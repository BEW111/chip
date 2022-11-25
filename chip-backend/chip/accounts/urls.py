from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from accounts import views

urlpatterns = [
    path('accounts/', views.ChipUserList.as_view()),
    path('accounts/<int:pk>/', views.ChipUserDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)