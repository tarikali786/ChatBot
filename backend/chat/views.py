# chat/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from rest_framework.permissions import IsAuthenticated
from users.models import Users
from chat.models import ChatRoom, Conversation
from chat.serializers import ChatRoomSerializer, FriendSerializer


class ChatConnect(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, userID):
        # Get the current user
        user = request.user

        # Find the friend by their UUID
        friend = Users.objects.filter(uuid=userID).first()

        if friend:
            # Check if a chat room already exists between the user and the friend
            existing_room = ChatRoom.objects.filter(
                user=user, friend=friend).first()

            if existing_room:
                # If a room already exists, return its roomID
                room_id = existing_room.roomID
            else:
                # Create a new chat room
                new_room = ChatRoom.objects.create(user=user, friend=friend)
                room_id = new_room.roomID
                new_friend_room = ChatRoom.objects.create(
                    user=friend, friend=user)

            return Response({'status': 'Connected', 'roomID': room_id}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class ChatDisconnect(APIView):
    @database_sync_to_async
    def post(self, request):
        if self.user.is_authenticated:
            room_name = request.data['roomId']
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_discard)(
                room_name, self.channel_name)
            return Response({'status': 'Disconnected'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


class UserFriendsViews(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Fetch friend information using a single query
        chat_rooms = ChatRoom.objects.filter(user=user).select_related('friend').values(
            'friend__uuid',
            'friend__email',
            'friend__username',
            'friend__name',
            'friend__profile_image',
            'roomID'
        )

        # Serialize the data using the FriendSerializer
        friends_info = FriendSerializer(chat_rooms, many=True).data

        return Response({"friends_info": friends_info}, status=status.HTTP_200_OK)


# class UserFriendsViews(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user

#         # Filter ChatRoom objects where the 'user' field matches the authenticated user.
#         chat_rooms = ChatRoom.objects.filter(user=user)

#         # Initialize a list to store user information
#         friends_info = []

#         # Iterate through friend chat rooms and retrieve user information
#         for chat_room in chat_rooms:
#             friend_user = chat_room.friend

#             # Check if the friend user has a profile image
#             if friend_user.profile_image:
#                 profile_image_url = friend_user.profile_image.url
#             else:
#                 profile_image_url = None

#             friends_info.append({
#                 "id": friend_user.uuid,
#                 "email": friend_user.email,
#                 "username": friend_user.username,
#                 "name": friend_user.name,
#                 "profile_image_url": profile_image_url,
#                 # Add other fields you need
#             })

#         return Response({"friends_info": friends_info}, status=status.HTTP_200_OK)
