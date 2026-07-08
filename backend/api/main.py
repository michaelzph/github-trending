from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine, Base
from api.routes import router
from scraper.scheduler import init_scheduler, shutdown_scheduler

Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app):
    init_scheduler()
    yield
    shutdown_scheduler()


app = FastAPI(
    title="GitHub Trending API",
    description="Local GitHub Trending statistics API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
def root():
    return {"message": "GitHub Trending API", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
