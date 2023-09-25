<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Chat;
use App\Models\Task;
use App\Models\User;
use App\Models\Offer;
use App\Models\Country;
use App\Events\AddNewChat;
use App\Events\AddNewOffer;
use App\Models\ChatMessage;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Services\AwsService;
use App\Services\ChatService;
use App\Services\TaskService;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserInfoResource;
use App\Http\Requests\User\AvatarRequest;
use App\Http\Resources\TaskWithUserOffers;
use App\Http\Resources\ChatMessageResource;
use App\Http\Resources\TaskWithOfferResource;
use App\Http\Requests\User\AddMessageRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Requests\User\ChangePasswordRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/user",
     *     summary="User info",
     *     operationId="getInfo",
     *     tags={"User"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     ),
     *     @OA\Response(
     *          response=405,
     *          description="Redirect to Log in",
     *     )
     * )
     */
    public function getInfo(Request $request): JsonResponse
    {
        if (!$user = $request->user()) {
            return response()->json(
                [
                    'success' => false,
                ]
            );
        }

        return response()->json(
            [
                'success' => true,
                'data' => new UserResource($user),
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/user/{id}",
     *     summary="User info by id",
     *     operationId="getInfoById",
     *     tags={"User"},
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         example="1",
     *         required=true,
     *     ),
     *
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     ),
     *     @OA\Response(
     *          response=405,
     *          description="Redirect to Log in",
     *     )
     * )
     */
    public function getInfoById(Request $request, string $id): JsonResponse
    {
        if (!$user = User::find($id)) {
            return response()->json(
                [
                    'success' => false,
                ]
            );
        }

        return response()->json(
            [
                'success' => true,
                'data' => new UserInfoResource($user),
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/user",
     *     summary="User info",
     *     operationId="updateInfo",
     *     tags={"User"},
     *     requestBody={"$ref": "#/components/requestBodies/UpdateUserRequest"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     ),
     *     @OA\Response(
     *          response=405,
     *          description="Redirect to Log in",
     *     )
     * )
     */
    public function updateInfo(UpdateUserRequest $request, UserService $userService): JsonResponse
    {
        if (!$user = $request->user()) {
            return response()->json(
                [
                    'success' => false,
                ]
            );
        }

        $update = $userService->updateInfo(
            $user,
            $request->input('username'),
            $request->input('biography'),
            $request->input('country_id')
        );

        if (!$update) {
            return response()->json(
                [
                    'success' => false,
                ]
            );
        }

        return response()->json(
            [
                'success' => true,
                'data' => new UserResource($user),
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/countries",
     *     summary="Countries info",
     *     operationId="getCountries",
     *     tags={"User"},
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     )
     * )
     */
    public function getCountries(): JsonResponse
    {
        return response()->json(
            [
                'success' => true,
                'data' => Country::all()->toArray(),
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/user/change-password",
     *     summary="User changepassword",
     *     operationId="changePassword",
     *     tags={"User"},
     *     requestBody={"$ref": "#/components/requestBodies/ChangePasswordRequest"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     ),
     *     @OA\Response(
     *          response=405,
     *          description="Redirect to Log in",
     *     ),
     *      @OA\Response(
     *          response=422,
     *          description="Unprocessable Content",
     *      ),
     * )
     */
    public function changePassword(ChangePasswordRequest $request, UserService $userService): JsonResponse
    {
        if (!$user = $request->user()) {
            return response()->json(
                [
                    'success' => false,
                ]
            );
        }

        $update = $userService->changePassword(
            $user,
            $request->input('password'),
            $request->input('new_password')
        );

        if (!$update) {
            throw new HttpResponseException(response()->json([
                'success'   => false,
                'message'   => 'Validation errors',
                'data'      => __('auth.failed'),
            ], ResponseAlias::HTTP_UNPROCESSABLE_ENTITY));
        }

        return response()->json(
            [
                'success' => true,
                'data' => new UserResource($user),
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/user/avatar",
     *     summary="User set avatar",
     *     operationId="setAvatar",
     *     tags={"User"},
     *     requestBody={"$ref": "#/components/requestBodies/AvatarRequest"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     ),
     *     @OA\Response(
     *          response=405,
     *          description="Redirect to Log in",
     *     ),
     * )
     */
    public function setAvatar(AvatarRequest $request, UserService $userService, AwsService $awsService): JsonResponse
    {
        if (!$user = $request->user()) {
            return response()->json(
                [
                    'success' => false,
                ]
            );
        }

        try {
            $avatarUrl = $userService->setAvatar($user, $request->input('avatar'), $awsService);
            $user->update([
                'avatar' => $avatarUrl
            ]);
        } catch (Exception $e) {
            Log::error('UserController setAvatar exception', [$e->getMessage()]);

            return response()->json(
                [
                    'success' => false,
                    'message' => $e->getMessage(),
                    'data' => $user,
                ]
            );
        }

        return response()->json(
            [
                'success' => true,
                'data' => $user,
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/user/email-verify",
     *     summary="User verify email letter.",
     *     operationId="verifyEmail",
     *     tags={"User"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *      @OA\Response(
     *          response=200,
     *          description="OK",
     *      ),
     *      @OA\Response(
     *          response=422,
     *          description="Unprocessable Content",
     *      ),
     * )
     */
    public function verifyEmail(Request $request): JsonResponse
    {
        if (!$user = $request->user()) {
            return response()->json(
                [
                    'success' => false,
                ]
            );
        }

        if (!$user->hasVerifiedEmail()) {
            try {
                $user->sendEmailVerificationNotification();
            } catch (Exception $e) {
                return response()->json(
                    [
                        'success' => false,
                        'error' => $e->getMessage(),
                    ]
                );
            }
        }

        return response()->json(
            [
                'success' => true,
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/user/task/list",
     *     summary="Tasks list by user",
     *     operationId="getTasks",
     *     tags={"User"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     )
     * )
     */
    public function getTasks(Request $request): JsonResponse
    {
        if (!$user = $request->user()) {
            return response()->json(
                [
                    'success' => false,
                ]
            );
        }

        return response()->json(
            [
                'success' => true,
                'data' => TaskWithOfferResource::collection(Task::whereUserId($user->id)->get()),
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/user/task/{status}/list",
     *     summary="All user tasks by status",
     *     operationId="getTasksByStatus",
     *     tags={"User"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *     @OA\Parameter(
     *         name="status",
     *         in="path",
     *         example="waiting",
     *         required=true,
     *     ),
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     )
     * )
     */
    public function getTasksByStatus(Request $request, $status): JsonResponse
    {
        if (!$user = $request->user()) {
            return response()->json(
                [
                    'success' => false,
                ]
            );
        }

        return response()->json(
            [
                'success' => true,
                'data' => TaskResource::collection(Task::whereUserId($user->id)->whereStatus($status)->get()),
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/user/task/{id}/offer",
     *     summary="Add new offer to task",
     *     operationId="addOffer",
     *     tags={"User"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         example="1",
     *         required=true,
     *     ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="OK",
     *      ),
     *      @OA\Response(
     *          response=422,
     *          description="Unprocessable Content",
     *      ),
     * )
     */
    public function addOffer(Request $request, $taskId, TaskService $taskService): JsonResponse
    {
        if (!$task = Task::find($taskId)) {
            return response()->json(
                [
                    'success' => false,
                    'exists' => false,
                ]
            );
        }

        if (
            Offer::whereUserId($request->user()?->id)->whereTaskId($taskId)->exists() ||
            Offer::whereTaskId($taskId)->whereStatus(Offer::STATUS_ACCEPTED)->exists()
        ) {
            return response()->json(
                [
                    'success' => false,
                    'exists' => true,
                ]
            );
        }

        $offer = $taskService->addOffer($taskId, $request->user()?->id);

        event(new AddNewOffer($request->user(), $offer));
        event(new AddNewChat($request->user(), $task->user, $task));

        return response()->json(
            [
                'success' => (bool) $offer,
                'data' => new TaskWithUserOffers($task, $request->user()->id),
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/user/offer/list",
     *     summary="Offers list by user",
     *     operationId="getOffers",
     *     tags={"User"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     )
     * )
     */
    public function getOffers(Request $request): JsonResponse
    {
        if (!$user = $request->user()) {
            return response()->json(
                [
                    'success' => false,
                ]
            );
        }

        return response()->json(
            [
                'success' => true,
                'data' => Offer::with('task')->whereUserId($user->id)->latest()->get(),
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/user/offer/remove/{id}",
     *     summary="Remove user offer",
     *     operationId="removeOfferById",
     *     tags={"User"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         example="1",
     *         required=true,
     *     ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="OK",
     *      ),
     *      @OA\Response(
     *          response=422,
     *          description="Unprocessable Content",
     *      ),
     * )
     */
    public function removeOfferById(Request $request, $offerId, ChatService $chatService): JsonResponse
    {
        if ($offer = Offer::whereId($offerId)->whereUserId($request->user()->id)->first()) {
            $chatService->disableChatByOffer($offer);
        }

        return response()->json(
            [
                'exists' => (bool) $offer,
                'success' => (bool) $offer->delete(),
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/user/notification/list",
     *     summary="All notifications by user",
     *     operationId="getNotifications",
     *     tags={"User"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     )
     * )
     */
    public function getNotifications(Request $request): JsonResponse
    {
        if (!$user = $request->user()) {
            return response()->json(
                [
                    'success' => false,
                ]
            );
        }

        return response()->json(
            [
                'success' => true,
                'data' => Notification::whereUserId($user->id)
                    ->whereRead(false)
                    ->latest()
                    ->get(),
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/user/notification/read-all",
     *     summary="Read all user notifications",
     *     operationId="markAllNotificationRead",
     *     tags={"User"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *
     *      @OA\Response(
     *          response=200,
     *          description="OK",
     *      ),
     *      @OA\Response(
     *          response=422,
     *          description="Unprocessable Content",
     *      ),
     * )
     */
    public function markAllNotificationRead(Request $request, UserService $userService): JsonResponse
    {
        if (!$user = $request->user()) {
            return response()->json(
                [
                    'success' => false,
                ]
            );
        }

        return response()->json(
            [
                'success' => (bool) $userService->readAllNotification($user),
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/user/notification/{id}/read",
     *     summary="Read 1 notification by ID",
     *     operationId="markNotificationIdRead",
     *     tags={"User"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         example="1",
     *         required=true,
     *     ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="OK",
     *      ),
     *      @OA\Response(
     *          response=422,
     *          description="Unprocessable Content",
     *      ),
     * )
     */
    public function markNotificationIdRead(Request $request, $notificationId, UserService $userService): JsonResponse
    {
        if (!$request->user()) {
            return response()->json(
                [
                    'success' => false,
                ]
            );
        }

        return response()->json(
            [
                'success' => (bool) $userService->readNotification($notificationId),
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/user/chat/{id}/messages",
     *     summary="Chat messages by chat id",
     *     operationId="getChatMessages",
     *     tags={"User"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         example="1",
     *         required=true,
     *     ),
     *
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     ),
     *     @OA\Response(
     *          response=405,
     *          description="Redirect to Log in",
     *     )
     * )
     */
    public function getChatMessages(Request $request, $chatId): JsonResponse
    {
        $chat = Chat::find($chatId);

        return response()->json(
            [
                'success' => true,
                'data' => ChatMessage::chatMessages($chat->user_one, $chat->user_two)
                    ->whereChatId($chatId)
                    ->orderBy('id', 'asc')
                    ->get(),
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/user/chat/{chat_id}/message",
     *     summary="Add message",
     *     operationId="addChatMessages",
     *     tags={"User"},
     *     requestBody={"$ref": "#/components/requestBodies/AddMessageRequest"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *
     *     @OA\Parameter(
     *         name="chat_id",
     *         in="path",
     *         example="1",
     *         required=true,
     *     ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="OK",
     *      ),
     *      @OA\Response(
     *          response=422,
     *          description="Unprocessable Content",
     *      ),
     * )
     */
    public function addChatMessages(AddMessageRequest $addMessageRequest, $chatId, ChatService $chatService): JsonResponse
    {
        if (!$chatService->addMessage($addMessageRequest->user()->id, $chatId, $addMessageRequest->post('message'))) {
            return response()->json(
                [
                    'success' => false,
                ]
            );
        }

        $chat = Chat::find($chatId);

        return response()->json(
            [
                'success' => true,
                'data' => ChatMessage::chatMessages($chat->user_one, $chat->user_two)
                    ->whereChatId($chatId)
                    ->orderBy('id', 'asc')
                    ->get(),
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/user/chat/message/{message_id}/read",
     *     summary="Set message as read",
     *     operationId="readChatMessage",
     *     tags={"User"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *
     *     @OA\Parameter(
     *         name="message_id",
     *         in="path",
     *         example="1",
     *         required=true,
     *     ),
     *
     *      @OA\Response(
     *          response=200,
     *          description="OK",
     *      ),
     *      @OA\Response(
     *          response=422,
     *          description="Unprocessable Content",
     *      ),
     * )
     */
    public function readChatMessage(Request $request, $messageId, UserService $userService): JsonResponse
    {
        return response()->json(
            [
                'success' => (bool) $userService->readMessage($messageId),
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/user/chat/new-messages",
     *     summary="All unread user messages",
     *     operationId="getNewMessages",
     *     tags={"User"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     ),
     *     @OA\Response(
     *          response=405,
     *          description="Redirect to Log in",
     *     )
     * )
     */
    public function getNewMessages(Request $request, UserService $userService, ChatService $chatService): JsonResponse
    {
        $userId = $request->user()->id;
        $chats = $chatService->getAllUserChats($userId);
        $messages = $userService->getUnreadMessages($chats->pluck('id')->toArray(), $userId);

        return response()->json(
            [
                'success' => true,
                'data' => ChatMessageResource::collection($messages),
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/user/chat/message/read-all",
     *     summary="Read all user messages",
     *     operationId="markAllMessagesRead",
     *     tags={"User"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *
     *      @OA\Response(
     *          response=200,
     *          description="OK",
     *      ),
     *      @OA\Response(
     *          response=422,
     *          description="Unprocessable Content",
     *      ),
     * )
     */
    public function markAllMessagesRead(Request $request, UserService $userService, ChatService $chatService): JsonResponse
    {
        $userId = $request->user()->id;
        $chats = $chatService->getAllUserChats($userId);

        return response()->json(
            [
                'success' => (bool) $userService->readAllMessages($chats->pluck('id')->toArray(), $userId),
            ]
        );
    }
}
