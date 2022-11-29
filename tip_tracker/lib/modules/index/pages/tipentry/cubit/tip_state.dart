part of 'tip_cubit.dart';

abstract class TipEntryState {}

class TipEntryInitial extends TipEntryState {}

class TipEntryLoading extends TipEntryState {}

class TipEntryLoaded extends TipEntryState {}

class TipEntryError extends TipEntryState {
  final String errorMessage;

  TipEntryError(this.errorMessage);
}
