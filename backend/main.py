import os
import json
import logging
import secrets
from datetime import datetime, timedelta, timezone
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy import create_engine, Column, Integer, String, Text, Float, Boolean, DateTime
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import List, Optional

import bcrypt
import jwt

# ---------------------------------------------------------------------------
# Configuration via environment variables (with sensible defaults for dev)
# ---------------------------------------------------------------------------
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv is optional; env vars can be set directly

# Render provides postgres:// but SQLAlchemy requires postgresql://
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cattery.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:5173"
).split(",")
DEFAULT_ADMIN_PASSWORD = os.getenv("DEFAULT_ADMIN_PASSWORD", "admin123")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("cattery")

# ---------------------------------------------------------------------------
# Database setup
# ---------------------------------------------------------------------------
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


# ---------------------------------------------------------------------------
# Database Models
# ---------------------------------------------------------------------------
class Kitten(Base):
    __tablename__ = "kittens"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    birth_date = Column(String)
    color = Column(String)
    gender = Column(String)
    price = Column(Float)
    description = Column(Text)
    image_url = Column(String)
    available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class WaitingList(Base):
    __tablename__ = "waiting_list"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, index=True)
    phone = Column(String)
    preferences = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class PageContent(Base):
    __tablename__ = "page_content"

    id = Column(Integer, primary_key=True, index=True)
    page_name = Column(String, unique=True, index=True)
    content = Column(Text)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class Parent(Base):
    __tablename__ = "parents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    gender = Column(String)
    color = Column(String)
    description = Column(Text)
    image_url = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    category = Column(String)
    image_url = Column(String)
    stock_quantity = Column(Integer, default=0)
    available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class AdminSettings(Base):
    __tablename__ = "admin_settings"

    id = Column(Integer, primary_key=True, index=True)
    setting_key = Column(String, unique=True, index=True)
    setting_value = Column(String)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


# ---------------------------------------------------------------------------
# Password hashing (bcrypt)
# ---------------------------------------------------------------------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


# ---------------------------------------------------------------------------
# JWT helpers
# ---------------------------------------------------------------------------
def create_access_token(data: dict) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {**data, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------
class KittenCreate(BaseModel):
    name: str
    birth_date: str
    color: str
    gender: str
    price: float
    description: str
    image_url: str = ""
    available: bool = True


class KittenResponse(KittenCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


class WaitingListCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    preferences: str = ""


class WaitingListResponse(WaitingListCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


class PageContentUpdate(BaseModel):
    page_name: str
    content: str


class PageContentResponse(PageContentUpdate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    updated_at: datetime


class ParentCreate(BaseModel):
    name: str
    gender: str
    color: str
    description: str
    image_url: str = ""


class ParentResponse(ParentCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: str = ""
    stock_quantity: int = 0
    available: bool = True


class ProductResponse(ProductCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


class AdminLogin(BaseModel):
    password: str


class AdminPasswordChange(BaseModel):
    current_password: str
    new_password: str


# ---------------------------------------------------------------------------
# Dependency – DB session
# ---------------------------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Auth dependency – require valid JWT on protected endpoints
# ---------------------------------------------------------------------------
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

bearer_scheme = HTTPBearer(auto_error=False)


def require_admin(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    verify_token(credentials.credentials)


# ---------------------------------------------------------------------------
# Seed / initialisation helpers
# ---------------------------------------------------------------------------
def init_default_content(db: Session):
    default_pages = {
        "home": json.dumps({
            "company_name": "Royal Abyssinians",
            "logo_url": "/images/aby_photo1.jpg",
            "affiliations": ["CFA - Cat Fanciers' Association", "TICA - The International Cat Association"],
            "tagline": "Premium Abyssinian Cat Breeder",
            "description": "Welcome to our cattery! We specialize in breeding beautiful, healthy Abyssinian cats. Our kittens are raised in a loving home environment and come with full health guarantees."
        }),
        "care": json.dumps({
            "title": "Caring for Your Abyssinian",
            "about_breed": "Abyssinians are highly intelligent, playful, and active cats. They are one of the oldest known cat breeds and are known for their distinctive ticked coat and elegant appearance.",
            "image_url": "/images/aby_kitten1.jpg",
            "care_tips": [
                "Provide interactive toys and climbing structures",
                "Feed high-quality cat food appropriate for their age",
                "Regular grooming once a week",
                "Annual veterinary check-ups",
                "Keep them mentally stimulated with puzzle toys"
            ]
        }),
        "about": json.dumps({
            "title": "About Us",
            "description": "We are dedicated breeders with over 10 years of experience with Abyssinian cats. Our passion is raising healthy, well-socialized kittens that make perfect family companions.",
            "contact": {
                "email": "contact@regalabyssinians.com",
                "phone": "(555) 123-4567",
                "address": "123 Cattery Lane, Cat City, ST 12345"
            },
            "payment_methods": ["Cash", "Zelle", "Venmo"]
        }),
        "social_media": json.dumps({
            "links": [
                {"platform": "Instagram", "url": "https://instagram.com/yourusername", "icon": "instagram"},
                {"platform": "Facebook", "url": "https://facebook.com/yourpage", "icon": "facebook"}
            ]
        })
    }

    for page_name, content in default_pages.items():
        existing = db.query(PageContent).filter(PageContent.page_name == page_name).first()
        if not existing:
            db.add(PageContent(page_name=page_name, content=content))
    db.commit()

    if db.query(Kitten).count() == 0:
        sample_kittens = [
            Kitten(name="Luna", birth_date="2024-09-15", color="Ruddy", gender="Female",
                   price=1200.00, description="Beautiful ruddy Abyssinian with an incredibly playful personality.",
                   image_url="/images/aby_kitten1.jpg", available=True),
            Kitten(name="Simba", birth_date="2024-09-20", color="Sorrel", gender="Male",
                   price=1100.00, description="Energetic sorrel male with stunning copper-red coat.",
                   image_url="/images/aby_kitten1.jpg", available=True),
            Kitten(name="Nala", birth_date="2024-08-25", color="Blue", gender="Female",
                   price=1300.00, description="Rare blue Abyssinian with exceptional temperament.",
                   image_url="/images/aby_kitten1.jpg", available=True),
            Kitten(name="Apollo", birth_date="2024-10-01", color="Fawn", gender="Male",
                   price=1250.00, description="Stunning fawn Abyssinian with warm beige tones.",
                   image_url="/images/aby_kitten1.jpg", available=False),
        ]
        for k in sample_kittens:
            db.add(k)
        db.commit()

    if db.query(Parent).count() == 0:
        sample_parents = [
            Parent(name="Bella", gender="Female", color="Ruddy",
                   description="Our beautiful breeding queen with champion bloodlines.",
                   image_url="/images/aby_photo1.jpg"),
            Parent(name="Duke", gender="Male", color="Sorrel",
                   description="Stunning male with exceptional temperament and excellent conformation.",
                   image_url="/images/aby_photo2.jpg"),
        ]
        for p in sample_parents:
            db.add(p)
        db.commit()


def init_admin_password(db: Session):
    existing = db.query(AdminSettings).filter(AdminSettings.setting_key == "admin_password").first()
    if not existing:
        hashed = hash_password(DEFAULT_ADMIN_PASSWORD)
        db.add(AdminSettings(setting_key="admin_password", setting_value=hashed))
        db.commit()
        logger.info("Default admin password initialised. Change it immediately via the admin panel.")


# ---------------------------------------------------------------------------
# Application lifespan (replaces deprecated on_event)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created / verified.")

    db = SessionLocal()
    try:
        init_default_content(db)
        init_admin_password(db)
    finally:
        db.close()
    logger.info("Startup initialisation complete.")

    yield  # Application runs

    # Shutdown
    logger.info("Shutting down.")


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(title="Abyssinian Cat Breeder API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Mount static files for images
images_path = os.path.join(os.path.dirname(__file__), "..", "images")
if os.path.exists(images_path):
    app.mount("/images", StaticFiles(directory=images_path), name="images")


# ---------------------------------------------------------------------------
# Serve the React frontend build in production
# ---------------------------------------------------------------------------
frontend_build = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.isdir(frontend_build):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_build, "assets")), name="frontend-assets")


# ---------------------------------------------------------------------------
# API Endpoints — Public
# ---------------------------------------------------------------------------

# Kittens
@app.get("/api/kittens", response_model=List[KittenResponse])
def get_kittens(available_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(Kitten)
    if available_only:
        query = query.filter(Kitten.available == True)
    return query.all()


@app.get("/api/kittens/{kitten_id}", response_model=KittenResponse)
def get_kitten(kitten_id: int, db: Session = Depends(get_db)):
    kitten = db.query(Kitten).filter(Kitten.id == kitten_id).first()
    if not kitten:
        raise HTTPException(status_code=404, detail="Kitten not found")
    return kitten


# Waiting List (public submission)
@app.post("/api/waiting-list", response_model=WaitingListResponse)
def add_to_waiting_list(entry: WaitingListCreate, db: Session = Depends(get_db)):
    db_entry = WaitingList(**entry.model_dump())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


# Page Content (public read)
@app.get("/api/content/{page_name}", response_model=PageContentResponse)
def get_page_content(page_name: str, db: Session = Depends(get_db)):
    content = db.query(PageContent).filter(PageContent.page_name == page_name).first()
    if not content:
        raise HTTPException(status_code=404, detail="Page content not found")
    return content


# Parents (public read)
@app.get("/api/parents", response_model=List[ParentResponse])
def get_parents(db: Session = Depends(get_db)):
    return db.query(Parent).all()


@app.get("/api/parents/{parent_id}", response_model=ParentResponse)
def get_parent(parent_id: int, db: Session = Depends(get_db)):
    parent = db.query(Parent).filter(Parent.id == parent_id).first()
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    return parent


# Products (public read)
@app.get("/api/products", response_model=List[ProductResponse])
def get_products(available_only: bool = False, category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Product)
    if available_only:
        query = query.filter(Product.available == True)
    if category:
        query = query.filter(Product.category == category)
    return query.all()


@app.get("/api/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# ---------------------------------------------------------------------------
# Admin Authentication
# ---------------------------------------------------------------------------
@app.post("/api/admin/login")
def admin_login(login: AdminLogin, db: Session = Depends(get_db)):
    admin_setting = db.query(AdminSettings).filter(AdminSettings.setting_key == "admin_password").first()
    if not admin_setting:
        raise HTTPException(status_code=500, detail="Admin password not configured")

    if not verify_password(login.password, admin_setting.setting_value):
        raise HTTPException(status_code=401, detail="Incorrect password")

    token = create_access_token({"sub": "admin"})
    return {"message": "Login successful", "authenticated": True, "token": token}


@app.post("/api/admin/change-password", dependencies=[Depends(require_admin)])
def change_admin_password(password_change: AdminPasswordChange, db: Session = Depends(get_db)):
    admin_setting = db.query(AdminSettings).filter(AdminSettings.setting_key == "admin_password").first()
    if not admin_setting:
        raise HTTPException(status_code=500, detail="Admin password not configured")

    if not verify_password(password_change.current_password, admin_setting.setting_value):
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    if len(password_change.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")

    admin_setting.setting_value = hash_password(password_change.new_password)
    admin_setting.updated_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Password changed successfully"}


# ---------------------------------------------------------------------------
# API Endpoints — Protected (admin only)
# ---------------------------------------------------------------------------
@app.post("/api/kittens", response_model=KittenResponse, dependencies=[Depends(require_admin)])
def create_kitten(kitten: KittenCreate, db: Session = Depends(get_db)):
    db_kitten = Kitten(**kitten.model_dump())
    db.add(db_kitten)
    db.commit()
    db.refresh(db_kitten)
    return db_kitten


@app.put("/api/kittens/{kitten_id}", response_model=KittenResponse, dependencies=[Depends(require_admin)])
def update_kitten(kitten_id: int, kitten: KittenCreate, db: Session = Depends(get_db)):
    db_kitten = db.query(Kitten).filter(Kitten.id == kitten_id).first()
    if not db_kitten:
        raise HTTPException(status_code=404, detail="Kitten not found")
    for key, value in kitten.model_dump().items():
        setattr(db_kitten, key, value)
    db.commit()
    db.refresh(db_kitten)
    return db_kitten


@app.delete("/api/kittens/{kitten_id}", dependencies=[Depends(require_admin)])
def delete_kitten(kitten_id: int, db: Session = Depends(get_db)):
    db_kitten = db.query(Kitten).filter(Kitten.id == kitten_id).first()
    if not db_kitten:
        raise HTTPException(status_code=404, detail="Kitten not found")
    db.delete(db_kitten)
    db.commit()
    return {"message": "Kitten deleted successfully"}


# Waiting List (admin read/delete)
@app.get("/api/waiting-list", response_model=List[WaitingListResponse], dependencies=[Depends(require_admin)])
def get_waiting_list(db: Session = Depends(get_db)):
    return db.query(WaitingList).all()


@app.delete("/api/waiting-list/{entry_id}", dependencies=[Depends(require_admin)])
def remove_from_waiting_list(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(WaitingList).filter(WaitingList.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
    return {"message": "Entry removed successfully"}


# Page Content (admin write)
@app.put("/api/content", response_model=PageContentResponse, dependencies=[Depends(require_admin)])
def update_page_content(content: PageContentUpdate, db: Session = Depends(get_db)):
    db_content = db.query(PageContent).filter(PageContent.page_name == content.page_name).first()
    if not db_content:
        db_content = PageContent(page_name=content.page_name, content=content.content)
        db.add(db_content)
    else:
        db_content.content = content.content
        db_content.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_content)
    return db_content


# Parents (admin write)
@app.post("/api/parents", response_model=ParentResponse, dependencies=[Depends(require_admin)])
def create_parent(parent: ParentCreate, db: Session = Depends(get_db)):
    db_parent = Parent(**parent.model_dump())
    db.add(db_parent)
    db.commit()
    db.refresh(db_parent)
    return db_parent


@app.put("/api/parents/{parent_id}", response_model=ParentResponse, dependencies=[Depends(require_admin)])
def update_parent(parent_id: int, parent: ParentCreate, db: Session = Depends(get_db)):
    db_parent = db.query(Parent).filter(Parent.id == parent_id).first()
    if not db_parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    for key, value in parent.model_dump().items():
        setattr(db_parent, key, value)
    db.commit()
    db.refresh(db_parent)
    return db_parent


@app.delete("/api/parents/{parent_id}", dependencies=[Depends(require_admin)])
def delete_parent(parent_id: int, db: Session = Depends(get_db)):
    db_parent = db.query(Parent).filter(Parent.id == parent_id).first()
    if not db_parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    db.delete(db_parent)
    db.commit()
    return {"message": "Parent deleted successfully"}


# Products (admin write)
@app.post("/api/products", response_model=ProductResponse, dependencies=[Depends(require_admin)])
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@app.put("/api/products/{product_id}", response_model=ProductResponse, dependencies=[Depends(require_admin)])
def update_product(product_id: int, product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.model_dump().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product


@app.delete("/api/products/{product_id}", dependencies=[Depends(require_admin)])
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}


# ---------------------------------------------------------------------------
# Health / root
# ---------------------------------------------------------------------------
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "environment": ENVIRONMENT}


# ---------------------------------------------------------------------------
# Dynamic SEO: build structured data + noscript from database content
# ---------------------------------------------------------------------------
from fastapi.responses import HTMLResponse

SITE_URL = os.getenv("SITE_URL", "https://royalabycattery.com")


def build_seo_html(db: Session) -> tuple:
    """Read admin-managed content from DB and return (json_ld, noscript) HTML."""
    # Load content from database
    home_row = db.query(PageContent).filter(PageContent.page_name == "home").first()
    about_row = db.query(PageContent).filter(PageContent.page_name == "about").first()
    social_row = db.query(PageContent).filter(PageContent.page_name == "social_media").first()

    home = json.loads(home_row.content) if home_row else {}
    about = json.loads(about_row.content) if about_row else {}
    social = json.loads(social_row.content) if social_row else {}

    company = home.get("company_name", "Royal Abyssinians")
    tagline = home.get("tagline", "")
    description = home.get("description", "")
    affiliations = home.get("affiliations", [])
    logo_url = home.get("logo_url", "/images/aby_photo1.jpg")

    contact = about.get("contact", {})
    email = contact.get("email", "")
    phone = contact.get("phone", "")
    address_str = contact.get("address", "")
    payment_methods = about.get("payment_methods", [])

    social_links = social.get("links", [])
    same_as = json.dumps([l.get("url", "") for l in social_links if l.get("url")])

    # Parse address loosely: "Street, City, ST ZIP" format
    addr_parts = [p.strip() for p in address_str.split(",")]
    street = addr_parts[0] if len(addr_parts) > 0 else ""
    city = addr_parts[1] if len(addr_parts) > 1 else ""
    state_zip = addr_parts[2] if len(addr_parts) > 2 else ""
    state = state_zip.split()[0] if state_zip else ""
    zipcode = state_zip.split()[1] if len(state_zip.split()) > 1 else ""

    full_logo = f"{SITE_URL}{logo_url}" if logo_url.startswith("/") else logo_url

    # --- JSON-LD blocks ---
    org_ld = json.dumps({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": company,
        "url": SITE_URL,
        "logo": full_logo,
        "image": full_logo,
        "description": description,
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": phone,
            "contactType": "sales",
            "email": email,
            "availableLanguage": "English"
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": street,
            "addressLocality": city,
            "addressRegion": state,
            "postalCode": zipcode,
            "addressCountry": "US"
        },
        "sameAs": [l.get("url", "") for l in social_links if l.get("url")]
    }, indent=2)

    local_ld = json.dumps({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": company,
        "description": f"{tagline}. {description}" if tagline else description,
        "url": SITE_URL,
        "image": [
            f"{SITE_URL}/images/aby_photo1.jpg",
            f"{SITE_URL}/images/aby_photo2.jpg",
            f"{SITE_URL}/images/aby_kitten1.jpg"
        ],
        "telephone": phone,
        "email": email,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": street,
            "addressLocality": city,
            "addressRegion": state,
            "postalCode": zipcode,
            "addressCountry": "US"
        },
        "priceRange": "$1100 - $1300",
        "paymentAccepted": payment_methods,
        "currenciesAccepted": "USD",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Abyssinian Kittens",
            "itemListElement": [{
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Product",
                    "name": "Abyssinian Kitten",
                    "description": "Purebred Abyssinian kitten, health guaranteed, raised in a loving home. Available in Ruddy, Sorrel, Blue, and Fawn colors.",
                    "image": f"{SITE_URL}/images/aby_kitten1.jpg",
                    "brand": {"@type": "Brand", "name": company},
                    "category": "Pets > Cats > Abyssinian"
                },
                "priceCurrency": "USD",
                "price": "1100.00",
                "availability": "https://schema.org/InStock",
                "seller": {"@type": "Organization", "name": company}
            }]
        },
        "memberOf": [{"@type": "Organization", "name": a} for a in affiliations]
    }, indent=2)

    website_ld = json.dumps({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": company,
        "url": SITE_URL,
        "description": f"{company} - {tagline}" if tagline else company
    }, indent=2)

    breadcrumb_ld = json.dumps({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE_URL}/"},
            {"@type": "ListItem", "position": 2, "name": "Available Kittens", "item": f"{SITE_URL}/kittens"},
            {"@type": "ListItem", "position": 3, "name": "Care Guide", "item": f"{SITE_URL}/care"},
            {"@type": "ListItem", "position": 4, "name": "About Us", "item": f"{SITE_URL}/about"}
        ]
    }, indent=2)

    json_ld_html = (
        f'<script type="application/ld+json">{org_ld}</script>\n'
        f'    <script type="application/ld+json">{local_ld}</script>\n'
        f'    <script type="application/ld+json">{website_ld}</script>\n'
        f'    <script type="application/ld+json">{breadcrumb_ld}</script>'
    )

    # --- Meta tags (dynamic) ---
    meta_desc = f"{company} is a trusted Abyssinian cat breeder offering beautiful, healthy Abyssinian kittens for sale. {', '.join(affiliations[:2])} registered. Browse available kittens and join our waiting list."
    meta_html = (
        f'<title>{company} | Abyssinian Kittens for Sale | Abyssinian Cat Breeder</title>\n'
        f'    <meta name="description" content="{meta_desc}" />\n'
        f'    <meta property="og:title" content="{company} | Abyssinian Kittens for Sale" />\n'
        f'    <meta property="og:description" content="{meta_desc}" />\n'
        f'    <meta property="og:site_name" content="{company}" />\n'
        f'    <meta property="og:image" content="{full_logo}" />\n'
        f'    <meta name="twitter:title" content="{company} | Abyssinian Kittens for Sale" />\n'
        f'    <meta name="twitter:description" content="{meta_desc}" />\n'
        f'    <meta name="twitter:image" content="{full_logo}" />'
    )

    # --- Noscript fallback ---
    affiliations_li = "".join(f"<li>{a}</li>" for a in affiliations)
    payment_str = ", ".join(payment_methods) if payment_methods else "Contact us"
    noscript_html = (
        f'<noscript>\n'
        f'      <div style="max-width:800px;margin:0 auto;padding:40px 20px;font-family:sans-serif;">\n'
        f'        <h1>{company} - Abyssinian Kittens for Sale</h1>\n'
        f'        <p>{description}</p>\n'
        f'        <h2>Available Abyssinian Kittens</h2>\n'
        f'        <p>We have purebred Abyssinian kittens available in Ruddy, Sorrel, Blue, and Fawn colors. Prices range from $1,100 to $1,300. All kittens come health-checked, vaccinated, and socialized. Visit our <a href="/kittens">kittens page</a> to see currently available Abyssinian kittens for sale and join our waiting list.</p>\n'
        f'        <h2>Our Affiliations</h2>\n'
        f'        <ul>{affiliations_li}</ul>\n'
        f'        <h2>Contact {company}</h2>\n'
        f'        <ul>\n'
        f'          <li>Email: <a href="mailto:{email}">{email}</a></li>\n'
        f'          <li>Phone: {phone}</li>\n'
        f'          <li>Address: {address_str}</li>\n'
        f'        </ul>\n'
        f'        <p>Payment methods accepted: {payment_str}</p>\n'
        f'        <h2>Quick Links</h2>\n'
        f'        <ul>\n'
        f'          <li><a href="/">Home</a></li>\n'
        f'          <li><a href="/kittens">Available Abyssinian Kittens for Sale</a></li>\n'
        f'          <li><a href="/care">Abyssinian Cat Care Guide</a></li>\n'
        f'          <li><a href="/about">About Us &amp; Contact</a></li>\n'
        f'        </ul>\n'
        f'      </div>\n'
        f'    </noscript>'
    )

    return json_ld_html, meta_html, noscript_html


def serve_index_with_seo(db: Session):
    """Read index.html template and inject dynamic SEO content."""
    index_file = os.path.join(frontend_build, "index.html")
    if not os.path.isfile(index_file):
        return None

    with open(index_file, "r") as f:
        html = f.read()

    json_ld_html, meta_html, noscript_html = build_seo_html(db)

    # Replace placeholders
    html = html.replace("<!-- DYNAMIC_STRUCTURED_DATA -->", json_ld_html)
    html = html.replace("<!-- DYNAMIC_META_TAGS -->", meta_html)
    html = html.replace("<!-- DYNAMIC_NOSCRIPT -->", noscript_html)

    return HTMLResponse(content=html)


@app.get("/")
def root(db: Session = Depends(get_db)):
    result = serve_index_with_seo(db)
    if result:
        return result
    return {"message": "Abyssinian Cat Breeder API", "status": "running"}


# Catch-all for client-side routing (React Router)
@app.get("/{full_path:path}")
def serve_spa(full_path: str, db: Session = Depends(get_db)):
    # Don't catch API or static routes
    if full_path.startswith("api/") or full_path.startswith("images/") or full_path.startswith("assets/"):
        raise HTTPException(status_code=404, detail="Not found")

    # Serve static files like robots.txt and sitemap.xml directly
    static_file = os.path.join(frontend_build, full_path)
    if os.path.isfile(static_file) and not full_path.endswith(".html"):
        return FileResponse(static_file)

    result = serve_index_with_seo(db)
    if result:
        return result

    raise HTTPException(status_code=404, detail="Not found")


# ---------------------------------------------------------------------------
# Run with: python main.py   (for development only)
# Production: uvicorn main:app --host 0.0.0.0 --port $PORT
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
