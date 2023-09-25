<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Task;
use App\Models\Offer;
use App\Events\DoneTask;
use App\Events\AcceptOffer;
use App\Events\RejectOffer;
use App\Helpers\ImageHelper;
use App\Models\TaskCategory;
use Illuminate\Http\Request;
use App\Services\AwsService;
use App\Services\ChatService;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\TaskResource;
use App\Http\Requests\Task\TaskRequest;
use App\Http\Requests\Task\TaskEditRequest;
use App\Http\Resources\TaskCreatorResource;

class TaskController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/task",
     *     summary="Create new task",
     *     operationId="createTask",
     *     tags={"Task"},
     *     requestBody={"$ref": "#/components/requestBodies/TaskRequest"},
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
    public function createTask(TaskRequest $request, TaskService $taskService, AwsService $awsService): JsonResponse
    {
        try {
            $logoPath = ($request->input('logo')) ?
                ImageHelper::decodeIncomingBase64($request->input('logo')) ?? null :
                null;

            $task = $taskService->createTask(
                $request->user(),
                $request->input('name'),
                $request->input('description'),
                $request->input('category_id'),
                $logoPath,
                $awsService
            );

            if (!$task) {
                return response()->json(
                    [
                        'success' => false,
                        'exists' => true,
                        'limit' => 1,
                    ]
                );
            }
        } catch (Exception $e) {
            Log::error('TaskController createTask exception', [$e->getMessage()]);

            return response()->json(
                [
                    'success' => false,
                    'message' => $e->getMessage(),
                ]
            );
        }

        return response()->json(
            [
                'success' => true,
                'data' => new TaskResource($task),
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/task/{task_id}/edit",
     *     summary="Edit task",
     *     operationId="editTask",
     *     tags={"Task"},
     *     requestBody={"$ref": "#/components/requestBodies/TaskEditRequest"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *
     *     @OA\Parameter(
     *         name="task_id",
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
    public function editTask(TaskEditRequest $request, $taskId, TaskService $taskService, AwsService $awsService): JsonResponse
    {
        try {
            $logoPath = ($request->input('logo')) ?
                ImageHelper::decodeIncomingBase64($request->input('logo')) ?? null :
                null;

            $task = $taskService->editTask(
                $taskId,
                $request->input('name'),
                $request->input('description'),
                $request->input('category_id'),
                $request->input('status'),
                $logoPath,
                $awsService
            );

            if (!$task) {
                return response()->json(
                    [
                        'success' => false,
                        'exists' => false,
                    ]
                );
            }
        } catch (Exception $e) {
            Log::error('TaskController editTask exception', [$e->getMessage()]);

            return response()->json(
                [
                    'success' => false,
                    'message' => $e->getMessage(),
                ]
            );
        }

        return response()->json(
            [
                'success' => true,
                'data' => new TaskResource($task),
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/task/statuses",
     *     summary="All available task statuses",
     *     operationId="getTaskStatuses",
     *     tags={"Task"},
     *
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     )
     * )
     */
    public function getTaskStatuses(Request $request): JsonResponse
    {
        return response()->json(
            [
                'success' => true,
                'data' => Task::allStatusesText(),
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/categories",
     *     summary="Categories list",
     *     operationId="getCategories",
     *     tags={"Task"},
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     )
     * )
     */
    public function getCategories(Request $request): JsonResponse
    {
        return response()->json(
            [
                'success' => true,
                'data' => TaskCategory::all()->toArray(),
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/task/categories",
     *     summary="Categories list with tasks",
     *     operationId="getCategoriesWithTasks",
     *     tags={"Task"},
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     )
     * )
     */
    public function getCategoriesWithTasks(Request $request): JsonResponse
    {
        $data = TaskCategory::with(['tasks.user', "tasks" => function($q) {
            $q->where('tasks.status', '=', Task::STATUS_WAITING)
                ->orderBy('tasks.id', 'DESC');
        }])
            ->get();

        $data = $data->map(function ($category) {
            $category->tasks->each(function ($task, int $key) use ($category) {
                if ($key >= Task::COUNT_MAIN_PAGE) {
                    $category->tasks->forget($key);
                }
            });

            return $category;
        })->all();

        return response()->json(
            [
                'success' => true,
                'data' => $data,
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/task/list/all",
     *     summary="All tasks list",
     *     operationId="getAllTasks",
     *     tags={"Task"},
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     )
     * )
     */
    public function getAllTasks(Request $request): JsonResponse
    {
        return response()->json(
            [
                'success' => true,
                'data' => TaskResource::collection(Task::latest()->get()),
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/task/list/{status}/all",
     *     summary="All tasks list by status",
     *     operationId="getAllTasksByStatus",
     *     tags={"Task"},
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
    public function getAllTasksByStatus(Request $request, $status): JsonResponse
    {
        return response()->json(
            [
                'success' => true,
                'data' => TaskResource::collection(Task::whereStatus($status)->latest()->get()),
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/task/{id}/change-status",
     *     summary="Change task status",
     *     operationId="changeStatus",
     *     tags={"Task"},
     *     requestBody={"$ref": "#/components/requestBodies/TaskStatusRequest"},
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
    public function changeStatus(Request $request, $taskId, TaskService $taskService): JsonResponse
    {
        if (!Task::find($taskId)) {
            return response()->json(
                [
                    'success' => false,
                    'exists' => false,
                ]
            );
        }

        return response()->json(
            [
                'success' => (bool) $taskService->changeStatus($request->user()?->id, $taskId, $request->input('status')),
                'data' => new TaskResource(Task::find($taskId)),
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/task/{id}/close",
     *     summary="Close task",
     *     operationId="closeTask",
     *     tags={"Task"},
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
    public function closeTask(Request $request, $taskId, TaskService $taskService, ChatService $chatService): JsonResponse
    {
        if (!$task = Task::find($taskId)) {
            return response()->json(
                [
                    'success' => false,
                    'exists' => false,
                ]
            );
        }

        /** @var Offer $executorOffer */
        $executorOffer = Offer::whereTaskId($taskId)
            ->whereStatus(Offer::STATUS_ACCEPTED)
            ->first();

        if ($request->user()->id == $task->user_id) {
            $taskService->changeStatus($request->user()?->id, $taskId, Task::STATUS_CLOSED);
            foreach (Offer::whereTaskId($taskId)->get() as $offer) {
                $chatService->disableChatByOffer($offer);
                if ($offer->user_id == $executorOffer?->user_id) {
                    $taskService->changeOfferStatus($executorOffer->id, Offer::STATUS_REJECTED);
                    continue;
                }

                $taskService->changeOfferStatus($offer->id, Offer::STATUS_REJECTED);

                event(new RejectOffer($offer));
            }
        } elseif ($executorOffer) {
                $taskService->changeStatus($request->user()?->id, $taskId, Task::STATUS_DONE);

                event(new DoneTask($task));
        }

        return response()->json(
            [
                'success' => true,
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/task/list/{category_id}",
     *     summary="All tasks by category id",
     *     operationId="getTasksByCategoryId",
     *     tags={"Task"},
     *
     *     @OA\Parameter(
     *         name="category_id",
     *         in="path",
     *         example="1",
     *         required=true,
     *     ),
     *
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     )
     * )
     */
    public function getTasksByCategoryId(Request $request, $categoryId): JsonResponse
    {
        return response()->json(
            [
                'success' => true,
                'data' => TaskResource::collection(
                    Task::whereStatus(Task::STATUS_WAITING)
                        ->whereCategoryId($categoryId)
                        ->orderBy('id', 'DESC')
                        ->paginate(Task::COUNT_CATEGORY_PAGE)
                )
                    ->response()
                    ->getData(true),
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/task/{id}",
     *     summary="Task by id",
     *     operationId="getTaskById",
     *     tags={"Task"},
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
     *     )
     * )
     */
    public function getTaskById(Request $request, $taskId): JsonResponse
    {
        if (!$task = Task::find($taskId)) {
            return response()->json(
                [
                    'success' => false,
                    'exists' => false,
                ]
            );
        }

        return response()->json(
            [
                'success' => true,
                'data' => new TaskResource($task),
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/task/{id}/visitor",
     *     summary="Task by id for auth users",
     *     operationId="getTaskByIdForVisitor",
     *     tags={"Task"},
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
     *     )
     * )
     */
    public function getTaskByIdForVisitor(Request $request, $taskId): JsonResponse
    {
        /** @var Task $task */
        if (!$task = Task::find($taskId)) {
            return response()->json(
                [
                    'success' => false,
                    'exists' => false,
                ]
            );
        }

        if ($task->user_id == $request->user()->id) {
            return response()->json(
                [
                    'success' => true,
                    'data' => new TaskCreatorResource($task),
                ]
            );
        }

        return response()->json(
            [
                'success' => true,
                'data' => new TaskResource($task),
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/task/offer/{id}/change-status",
     *     summary="Change offer status",
     *     operationId="changeOfferStatus",
     *     tags={"Task"},
     *     requestBody={"$ref": "#/components/requestBodies/OfferStatusRequest"},
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
    public function changeOfferStatus(Request $request, $offerId, TaskService $taskService): JsonResponse
    {
        if (!Offer::find($offerId)) {
            return response()->json(
                [
                    'success' => false,
                    'exists' => false,
                ]
            );
        }

        return response()->json(
            [
                'success' => (bool) $taskService->changeOfferStatus($offerId, $request->input('status')),
            ]
        );
    }
    /**
     * @OA\Post(
     *     path="/api/task/offer/{id}/accept",
     *     summary="Accept offer",
     *     operationId="acceptOffer",
     *     tags={"Task"},
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
    public function acceptOffer(Request $request, $offerId, TaskService $taskService, ChatService $chatService): JsonResponse
    {
        /** @var Offer $offer */
        if (!$offer = Offer::find($offerId)) {
            return response()->json(
                [
                    'success' => false,
                    'exists' => false,
                ]
            );
        }

        if (!Task::whereStatus(Task::STATUS_WAITING)->whereId($offer->task_id)->get()) {
            return response()->json(
                [
                    'success' => false,
                    'exists' => true,
                    'error' => __('This task\'s offer was accepted')
                ]
            );
        }

        $taskService->changeStatus($offer->task->user_id, $offer->task_id, Task::STATUS_IN_PROGRESS);
        $taskService->changeOfferStatus($offerId, Offer::STATUS_ACCEPTED);

        event(new AcceptOffer($offer));

        foreach (Offer::whereTaskId($offer->task_id)->where('id', '<>', $offerId)->get() as $rejectedOffer) {
            $taskService->changeOfferStatus($rejectedOffer->id, Offer::STATUS_REJECTED);
            event(new RejectOffer($rejectedOffer));
        }

        $chatService->disableRejectedChatsByAcceptedOffer($offer);

        return response()->json(
            [
                'success' => true,
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/task/offer/{id}/reject",
     *     summary="Reject offer",
     *     operationId="rejectOffer",
     *     tags={"Task"},
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
    public function rejectOffer(Request $request, $offerId, TaskService $taskService, ChatService $chatService): JsonResponse
    {
        if (!$offer = Offer::find($offerId)) {
            return response()->json(
                [
                    'success' => false,
                    'exists' => false,
                ]
            );
        }

        $taskService->changeOfferStatus($offerId, Offer::STATUS_REJECTED);
        $chatService->disableChatByOffer($offer);

        event(new RejectOffer($offer));

        return response()->json(
            [
                'success' => true,
            ]
        );
    }
}
