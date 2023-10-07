from django.shortcuts import render
from users.models import Users
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from users.serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer, SearchUserSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

# Create your views here.


class Register(APIView):
    serializer_class = RegisterSerializer
    queryset = Users.objects.all()
    # authentication_classes=[]


class Register(APIView):

    def post(self, request):
        results = {}

        try:
            if Users.objects.filter(email=request.data["email"]):
                results["state"] = "USER_EXISTS"
                return Response(results, status=status.HTTP_200_OK)

            else:
                serializer = RegisterSerializer(data=request.data)
                if serializer.is_valid(raise_exception=True):
                    account = serializer.save()

                    results["state"] = "USER_REGISTERED"
                    results["name"] = f"{account.name}"
                    results["userID"] = account.uuid
                    user = Users.objects.get(email=account.email)
                    if not user.is_verified:
                        user.is_verified = True
                        user.save()

                    # refresh_token = RefreshToken.for_user(user).access_token

                else:
                    results["state"] = "REGISTRATION_UNSUCCESSFUL"
                    results["errors"] = serializer.errors

        except KeyError as e:
            results["state"] = "REGISTRATION_UNSUCCESSFUL"
            results["errors"] = "except_block_" + str(e)

        return Response(results, status=status.HTTP_200_OK)


class Login(APIView):
    serializer_class = LoginSerializer
    queryset = Users.objects.all()
    # authentication_classes=[]

    def post(self, request):
        login_data = {}

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = Users.objects.filter(email=email).first()

        if user:
            if user.check_password(password):
                if user.is_verified:
                    refresh = RefreshToken.for_user(user)
                    login(request, user,
                          backend='django.contrib.auth.backends.ModelBackend')

                    login_data["state"] = "USER_LOGGED_IN"
                    login_data["access_token"] = str(refresh.access_token)
                    login_data["refresh_token"] = str(refresh)
                    login_data["user_id"] = user.uuid
                else:
                    login_data["state"] = "USER_ACCOUNT_NOT_VERIFIED"
            else:
                login_data["state"] = "Password wrong!"
        else:
            login_data["state"] = "USER_DOES_NOT_EXIST"

        return Response(login_data, status=status.HTTP_200_OK)


class Logout(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        logout_data = {}

        try:

            if request.user.is_anonymous:
                logout_data["state"] = "ANONYMOUS_USER"
            else:
                logout_data["user"] = request.user.email
                logout(request)
                logout_data["state"] = "USER_LOGGED_OUT"

        except:
            logout_data["state"] = "REQUEST_NOT_PROCESSED"

        return Response(logout_data)


class UserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, userID):
        try:
            user = Users.objects.get(uuid=userID)
            serializer = UserProfileSerializer(user)
            return Response({"userProfile": serializer.data}, status=status.HTTP_200_OK)
        except Users.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)


class SearchUserApi(APIView):
    def post(self, request):
        # Get the user input from the request data
        # user = request.data.get('user')
        serializer = SearchUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['name']
        if not user:
            return Response({"user": "Please provide a search term"}, status=status.HTTP_400_BAD_REQUEST)

        # Use Q objects to define multiple search criteria
        find_user_query = Q(name__icontains=user) | Q(
            username__icontains=user) | Q(email__icontains=user)

        # Filter the Users queryset based on the search criteria
        found_users = Users.objects.filter(find_user_query)

        if found_users.exists():  # Check if any users were found
            return Response({"users": found_users.values()}, status=status.HTTP_200_OK)
        else:
            return Response({"user": "User not found"}, status=status.HTTP_404_NOT_FOUND)
