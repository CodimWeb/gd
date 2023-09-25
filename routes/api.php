<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;

Route::post('/auth/login', [AuthController::class, 'login'])
    ->name('login');

Route::post('/auth/register', [AuthController::class, 'register']);

Route::get('/email/verify', function () {
    return view('auth.verify-email');
});

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/reset-password-request', [AuthController::class, 'resetPasswordRequest']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/user/{id}', [UserController::class, 'getInfoById']);
Route::get('/countries', [UserController::class, 'getCountries']);
Route::get('/categories', [TaskController::class, 'getCategories']);
Route::get('/task/categories', [TaskController::class, 'getCategoriesWithTasks']);
Route::get('/task/statuses', [TaskController::class, 'getTaskStatuses']);
Route::get('/task/list/all', [TaskController::class, 'getAllTasks']);
Route::get('/task/list/{status}/all', [TaskController::class, 'getAllTasksByStatus']);
Route::get('/task/list/{category_id}', [TaskController::class, 'getTasksByCategoryId']);
Route::get('/task/{id}', [TaskController::class, 'getTaskById']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/user', [UserController::class, 'getInfo']);
    Route::post('/user', [UserController::class, 'updateInfo']);
    Route::post('/user/avatar', [UserController::class, 'setAvatar']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);
    Route::post('/user/email-verify', [UserController::class, 'verifyEmail']);
    Route::get('/user/task/list', [UserController::class, 'getTasks']);
    Route::get('/user/task/{status}/list', [UserController::class, 'getTasksByStatus']);
    Route::post('/user/task/{task_id}/offer', [UserController::class, 'addOffer']);
    Route::get('/user/offer/list', [UserController::class, 'getOffers']);
    Route::delete('/user/offer/remove/{id}', [UserController::class, 'removeOfferById']);
    Route::get('/user/notification/list', [UserController::class, 'getNotifications']);
    Route::post('/user/notification/read-all', [UserController::class, 'markAllNotificationRead']);
    Route::post('/user/notification/{notification_id}/read', [UserController::class, 'markNotificationIdRead']);
    Route::get('/user/chat/{chat_id}/messages', [UserController::class, 'getChatMessages']);
    Route::post('/user/chat/message/read-all', [UserController::class, 'markAllMessagesRead']);
    Route::post('/user/chat/message/{message_id}/read', [UserController::class, 'readChatMessage']);
    Route::post('/user/chat/{chat_id}/message', [UserController::class, 'addChatMessages']);
    Route::get('/user/chat/new-messages', [UserController::class, 'getNewMessages']);

    Route::post('/task', [TaskController::class, 'createTask']);
    Route::get('/task/{id}/visitor', [TaskController::class, 'getTaskByIdForVisitor']);
    Route::post('/task/{task_id}/edit', [TaskController::class, 'editTask']);
    Route::post('/task/{task_id}/change-status', [TaskController::class, 'changeStatus']);
    Route::post('/task/{task_id}/close', [TaskController::class, 'closeTask']);
    Route::post('/task/offer/{offer_id}/change-status', [TaskController::class, 'changeOfferStatus']);
    Route::post('/task/offer/{offer_id}/accept', [TaskController::class, 'acceptOffer']);
    Route::post('/task/offer/{offer_id}/reject', [TaskController::class, 'rejectOffer']);
});

Route::controller(\App\Http\Controllers\TestController::class)->group(function () {
    Route::get('/test-user/all', 'getAllUsers');
    Route::delete('/test-user/remove/{id}', 'removeUserById');
    Route::delete('/test-user/remove/email/{email}', 'removeUserByEmail');
    Route::delete('/test-task/remove/{id}', 'removeTaskById');
    Route::delete('/test-offer/remove/{id}', 'removeOfferById');
});

