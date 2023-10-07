from rest_framework import serializers
from chat.models import ChatRoom, Message
from users.serializers import UserSerializer


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = '__all__'


class FriendSerializer(serializers.Serializer):
    userid = serializers.UUIDField(source='friend__uuid')
    email = serializers.EmailField(source='friend__email')
    username = serializers.CharField(source='friend__username')
    name = serializers.CharField(source='friend__name')
    profile_image_url = serializers.ImageField(source='friend__profile_image')
    roomID = serializers.UUIDField()

    class Meta:
        ordering = ["-created"]


class MessageSerializer(serializers.ModelSerializer):
    from_user = serializers.SerializerMethodField()
    to_user = serializers.SerializerMethodField()
    conversation = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = (
            "id",
            "conversation",
            "from_user",
            "to_user",
            "content",
            "timestamp",
            "read",
        )

    def get_conversation(self, obj):
        return str(obj.conversation.id)

    def get_from_user(self, obj):
        return UserSerializer(obj.from_user).data

    def get_to_user(self, obj):
        return UserSerializer(obj.to_user).data
