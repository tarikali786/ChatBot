from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from django.urls import reverse

# Create your models here.


class Users(AbstractUser):
    uuid = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=200, blank=True, null=True,)
    name = models.CharField(max_length=250, blank=True, null=True)
    email = models.EmailField(verbose_name="email", unique=True,
                              blank=True, null=True, max_length=60, default=None)
    # Add this line for the image field
    profile_image  = models.ImageField(upload_to='avatar/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    auth_provider = models.CharField(
        max_length=255, blank=False, null=False, default="email"
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ["username"]

    def __str__(self) -> str:
        return self.name

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"name": self.name})
