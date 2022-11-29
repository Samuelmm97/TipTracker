part of 'profile_cubit.dart';

abstract class ProfileState {}

class ProfileInitial extends ProfileState {}

class ProfileLoading extends ProfileState {}

class ProfileLoaded extends ProfileState {}

class ProfileError extends ProfileState {
  final String errorMessage;

  ProfileError(this.errorMessage);
}
