from django.urls import path
from users.views import Register, Login, Logout, UserProfile, SearchUserApi
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
urlpatterns = [
    path("register/", Register.as_view(), name="Register"),
    path("login/", Login.as_view(), name="login"),
    path("logout/", Logout.as_view(), name="Logout"),
    path("userProfile/<userID>/", UserProfile.as_view(), name="UserProfile"),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("searchUser/", SearchUserApi.as_view())
]
