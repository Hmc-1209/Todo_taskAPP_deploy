from fastapi import FastAPI
import Router
from database import db


app = FastAPI()

app.include_router(Router.user)
app.include_router(Router.repository)
app.include_router(Router.task)
app.include_router(Router.tag)


@app.on_event("startup")
async def startup():
    await db.connect()


@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()
