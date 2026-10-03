import bcrypt
import jwt
import os
from datetime import datetime, timedelta, timezone

ALGORITHM = os.environ.get("HASH_ALGO_MEDFLOW", "HS256")
SECRET_KEY = os.environ.get("SECRET_KEY", "asdfkljawelrkjasdklfjasdlkfjasdljkaewrsdfasdkfjk")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def hash_password(password: str) -> str:
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")

def verifypassword(plain_pw, hashed_pw) -> bool:
    return bcrypt.checkpw(plain_pw.encode("utf-8"), hashed_pw.encode("utf-8"))

def encode_access_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.now(timezone.utc) + (
        timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    token = jwt.encode(
        payload=to_encode,
        key=SECRET_KEY,
        algorithm=ALGORITHM
    )
    return token

def decode_access_token(token:str) -> dict | None:
    try: 
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError as e:
        print(e)
        return None
