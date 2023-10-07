import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from chat.models import Conversation, Message
from users.models import Users
from chat.serializers import MessageSerializer


class ChatConsumer(JsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None
        self.conversation_name = None
        self.conversation = None

    def connect(self):

        print("connected")
        self.accept()
        self.conversation_name = f"{self.scope['url_route']['kwargs']['conversation_name']}"
        self.conversation, created = Conversation.objects.get_or_create(
            name=self.conversation_name)

        messages = self.conversation.messages.all().order_by(
            "timestamp")[0:50]
        self.send_json({
            "type": "last_50_messages",
            "messages": MessageSerializer(messages, many=True).data,
        })
        # print("Retrieved messages from the database", messages)

        async_to_sync(self.channel_layer.group_add)(
            self.conversation_name,
            self.channel_name,
        )
        self.send_json({
            "type": "welcome_message",
            "message": "Hey there! You are successfully connected"
        })

    def disconnect(self, code):
        print("DisConnected")
        return super().disconnect(code)

    def get_receiver(self):
        names = self.conversation_name.split("__")
        for name in names:
            if name != self.user.name:
                # This is the receiver
                return Users.objects.get(name=name)

    def receive_json(self, content, **kwargs):
        message_type = content['type']
        name = content['name']
        self.user = Users.objects.get(name=name)
        if message_type == "chat_message":
            message = Message.objects.create(
                from_user=self.user,
                to_user=self.get_receiver(),
                content=content['message'],
                conversation=self.conversation

            )
            async_to_sync(self.channel_layer.group_send)(
                self.conversation_name,
                {
                    "type": "chat_message_echo",
                    "name": content['name'],
                    "message": MessageSerializer(message).data,
                }

            )

        return super().receive_json(content, **kwargs)

    def chat_message_echo(self, event):
        # print(event)
        self.send_json(event)
