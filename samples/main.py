# Comment: Python sample
import os
from dataclasses import dataclass, field

MAX_RETRIES = 3


@dataclass
class User:
    id: int
    name: str
    tags: list[str] = field(default_factory=list)

    def greet(self, prefix: str = "Hi") -> str:
        return f"{prefix}, {self.name}! You have {len(self.tags)} tags."


async def fetch_users(limit: int = 10) -> list[User]:
    users = []
    for i in range(limit):
        if i % 2 == 0 and not os.getenv("DEBUG"):
            users.append(User(id=i, name=f"user{i}"))
    return users


if __name__ == "__main__":
    print(User(1, "Ziza").greet())
    pattern = r"^\w+@\w+\.com$"
    data = {"key": None, "enabled": True, "count": 0x1F}
