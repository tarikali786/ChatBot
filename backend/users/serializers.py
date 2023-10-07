from rest_framework import serializers
from .models import Users


class RegisterSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(
        required=False)  # Add this line for the image field

    class Meta:
        model = Users
        fields = "__all__"
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # Get the profile image if provided
        profile_image = validated_data.pop('profile_image', None)
        user = Users.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            name=validated_data["name"].capitalize(),
            password=validated_data["password"],
        )
        if profile_image:
            user.profile_image = profile_image  # Set the profile image if provided
            user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()


class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Users
        fields = "__all__"


class SearchUserSerializer(serializers.Serializer):
    name = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ["username", "name"]
