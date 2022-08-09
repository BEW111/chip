from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions

from chip_backend.chips.models import Chip
from chip_backend.chips.serializers import UserSerializer, GroupSerializer, ChipSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class ChipViewSet(viewsets.ModelViewSet):
    queryset = Chip.objects.all()
    serializer_class = ChipSerializer
    permission_classes = [permissions.IsAuthenticated]