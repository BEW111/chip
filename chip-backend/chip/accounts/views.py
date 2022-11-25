from accounts.models import ChipUser
from accounts.serializers import ChipUserSerializer
from rest_framework import mixins
from rest_framework import generics


class ChipUserList(generics.ListAPIView):
    queryset = ChipUser.objects.all()
    serializer_class = ChipUserSerializer


class ChipUserDetail(generics.RetrieveAPIView):
    queryset = ChipUser.objects.all()
    serializer_class = ChipUserSerializer