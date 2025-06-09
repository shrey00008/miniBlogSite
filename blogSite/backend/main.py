from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import datetime
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BlogCreate(BaseModel):
    Title: str = Field(...,min_length=1 )
    Discription: str  =Field(...,min_length=1 )
    Author: str=Field(...,min_length=1 )
    
class Blog(BlogCreate):
    blogId: int
    timestamp: datetime.datetime

blogs : Dict[int, Blog] = {}
cur = 0

@app.post("/blog/", response_model=Blog)
def createBlog(blogIn: BlogCreate):
    global cur
    cur += 1
    blog = Blog(blogId=cur, timestamp=datetime.datetime.utcnow(), **blogIn.model_dump())
    blogs[blog.blogId] = blog
    return blog

@app.get("/blog/", response_model=list[Blog])
def getAll():
    return list(blogs.values())



@app.get("/blogs/{blogId}", response_model=Blog)
def getBlog(blogId: int):
    blog = blogs.get(blogId)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not there")
    return blog

@app.put("/blog/{blogId}", response_model=Blog)
def updateBlog(blogId: int, blogIn: BlogCreate):
    existBlog = blogs.get(blogId)
    if not existBlog:
        raise HTTPException(status_code=404, detail="Blog not found or missing")
    updBlog= Blog(
        blogId= blogId,
        timestamp = datetime.datetime.utcnow(),
        **blogIn.model_dump()
    )
    blogs[blogId]= updBlog
    return updBlog

@app.delete("/blogs/{blog_id}", status_code=204)
def delete_blog(blog_id: int):
    if blog_id not in blogs:
        raise HTTPException(status_code=404, detail="Blog not found")
    del blogs[blog_id]