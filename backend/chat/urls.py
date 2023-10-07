from django.urls import path

from chat.views import ChatConnect, ChatDisconnect, UserFriendsViews

urlpatterns = [
    path("ConnectUser/<userID>/", ChatConnect.as_view()),
    path("getFriends/", UserFriendsViews.as_view()),

    path("chatDisConnect/", ChatDisconnect.as_view())
]
