from django.db import models
from users.models import Users
import uuid
from jsonfield import JSONField
# Create your models here.


class ChatRoom(models.Model):
    roomID = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Users, related_name='user',
                             null=True, blank=True, on_delete=models.CASCADE)
    friend = models.ForeignKey(
        Users, related_name='friend', on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=10, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user

    class Meta:
        ordering = ["-created"]


class Conversation(models.Model):
    id = models.UUIDField(unique=True, primary_key=True,
                          default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=240)
    online = models.ManyToManyField(to=Users, blank=True)

    def get_online_count(self):
        return self.online.count()

    def join(self, user):
        self.online.add(user)
        self.save()

    def leave(self, user):
        self.online.remove(user)
        self.save()

    def __str__(self):
        return f"{self.name}({self.get_online_count()})"


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages")

    from_user = models.ForeignKey(
        Users, on_delete=models.CASCADE, related_name="messages_from_me")

    to_user = models.ForeignKey(
        Users, on_delete=models.CASCADE, related_name="messages_to_me")

    content = models.CharField(max_length=50000)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def get_receiver(self):
        names = self.conversation.name.split("__")
        for name in names:
            if name != self.from_user.name:
                return Users.objects.get(name=name)

    def __str__(self):
        return f"{self.from_user.name} to {self.to_user.name}: {self.content}[{self.timestamp}]"
