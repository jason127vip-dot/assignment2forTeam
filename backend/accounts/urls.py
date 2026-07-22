from django.urls import path

from .views_login import LoginView
from .views_logout import LogoutView
from .views_register import RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
]
