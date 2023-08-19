from fastapi import FastAPI
import Router


app = FastAPI()

app.include_router(Router.user)
app.include_router(Router.repository)
app.include_router(Router.task)

