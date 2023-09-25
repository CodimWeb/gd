<?php

namespace App\Http\Controllers;

use Throwable;
use App\Models\User;
use Illuminate\Http\Request;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Redirector;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Password;
use App\Http\Requests\Auth\LogoutRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\RequestResetPasswordRequest;

/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="Documentation",
 * )
 *
 * @OA\Tag(
 *     name="Authentication & Registration",
 * )
 *
 * @OA\SecurityScheme(
 *   securityScheme="bearerAuth",
 *   in="header",
 *   name="Authorization",
 *   type="http",
 *   scheme="bearer",
 *   bearerFormat="JWT",
 * ),
 */
class AuthController extends Controller
{
    /**
     * @OA\Post(
     *      path="/api/auth/login",
     *      operationId="login",
     *      tags={"Authentication & Registration"},
     *      summary="User log in",
     *      description="Returns user data with token",
     *      requestBody={"$ref": "#/components/requestBodies/LoginRequest"},
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
    public function login(LoginRequest $request, AuthService $authService): JsonResponse
    {
        return response()->json(
            $authService->login(
                $request->post('email'),
                $request->post('password'),
            )
        );
    }

    /**
     * @OA\Post(
     *     path="/api/auth/register",
     *     summary="User registration",
     *     operationId="register",
     *     tags={"Authentication & Registration"},
     *     requestBody={"$ref": "#/components/requestBodies/RegisterRequest"},
     *      @OA\Response(
     *          response=200,
     *          description="OK",
     *      ),
     *      @OA\Response(
     *          response=422,
     *          description="Unprocessable Content",
     *      ),
     * )
     *
     * @throws Throwable
     */
    public function register(RegisterRequest $request, AuthService $authService): JsonResponse
    {
        $authService->register(
            $request->post('username'),
            $request->post('email'),
            $request->post('birthday'),
            $request->post('password')
        );

        return response()->json(
            $authService->login(
                $request->post('email'),
                $request->post('password'),
            )
        );
    }

    public function verify(Request $request): Redirector|RedirectResponse
    {
        $user = User::find($request->route('id'));
        if ($user->hasVerifiedEmail()) {
            return redirect('/?verification=success');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return redirect('/?verification=success');
    }

    /**
     * @OA\Post(
     *     path="/api/auth/logout",
     *     summary="User log out",
     *     description="Method revokes the current access token.",
     *     operationId="logout",
     *     tags={"Authentication & Registration"},
     *     security={
     *     {"bearerAuth": {}}
     *     },
     *     @OA\Response(
     *          response=200,
     *          description="OK",
     *     )
     * )
     */
    public function logout(LogoutRequest $request, AuthService $authService): JsonResponse
    {
        $authService->logout($request->user());

        return response()->json(
            [
                'success' => true,
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/reset-password-request",
     *     summary="User reset password request. Send email with reset link.",
     *     operationId="resetPasswordRequest",
     *     tags={"Authentication & Registration"},
     *     requestBody={"$ref": "#/components/requestBodies/RequestResetPasswordRequest"},
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
    public function resetPasswordRequest(RequestResetPasswordRequest $request): JsonResponse
    {
        if (!$user = User::whereEmail($request->input('email'))->first()) {
            return response()->json(
                [
                    'success' => false,
                ]
            );
        }

        $token = Password::getRepository()->create($user);
        $user->sendPasswordResetNotification($token);

        return response()->json(
            [
                'success' => true,
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/reset-password",
     *     summary="User change password",
     *     operationId="resetPassword",
     *     tags={"Authentication & Registration"},
     *     requestBody={"$ref": "#/components/requestBodies/ResetPasswordRequest"},
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
    public function resetPassword(ResetPasswordRequest $request, AuthService $authService): JsonResponse
    {
        return $authService->resetPasswordByEmail(
            $request->post('email'),
            $request->post('password'),
            $request->post('password_confirmation'),
            $request->post('token'),
        );
    }
}
