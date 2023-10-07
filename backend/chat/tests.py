import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from chat.models import Conversation, Message
from rest_framework.permissions import IsAuthenticated
from users.models import Users
from users.serializers import UserSerializer
from chat.serializers import MessageSerializer
from uuid import UUID


class ChatConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.conversation_name = None
        self.conversation = None

    class UUIDEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, UUID):
                return obj.hex
            return json.JSONEncoder.default(self, obj)

    @classmethod
    def encode_json(cls, content):
        return json.dumps(content, cls=cls.UUIDEncoder)

    def connect(self):
        print("Connected!")
        # self.user = self.scope["user"]
        # if not self.user.is_authenticated:
        #     print("user not authenTicated")
        #     return
        # print(f"Authenticated user: {self.user.username}")
        self.accept()
        self.conversation_name = f"{self.scope['url_route']['kwargs']['conversation_name']}"
        self.users, friend_name = self.conversation_name.split("__")

        self.conversation, created = Conversation.objects.get_or_create(
            name=self.conversation_name)

        self.user = Users.objects.get(name=self.users)
        self.friend = Users.objects.get(name=friend_name)

        print(f"Authenticated usersss: {self.friend.email}")

        # print(f"Authenticated user: {friend_name}")

        async_to_sync(self.channel_layer.group_add)(
            self.conversation_name,
            self.channel_name,
        )

        messages = self.conversation.messages.all().order_by("timestamp")[0:50]
        self.send_json({
            "type": "last_50_messages",
            "messages": MessageSerializer(messages, many=True).data,
        })

    def disconnect(self, code):
        print("Disconnected!")
        return super().disconnect(code)

    def receive_json(self, content, **kwargs):
        message_type = content['type']
        if message_type == "chat_message":
            message = Message.objects.create(
                from_user=self.user,
                to_user=self.friend,
                content=content['message'],
                conversation=self.conversation
            )
            async_to_sync(self.channel_layer.group_send)(
                self.conversation_name, {
                    "type": "chat_message_echo",
                    "name": self.user.username,
                    'message': MessageSerializer(message).data,
                })

        return super().receive_json(content, **kwargs)

    def chat_message_echo(self, event):
        print(event)
        self.send_json(event)
