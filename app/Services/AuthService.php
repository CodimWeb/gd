<?php

namespace App\Services;

use Throwable;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Exceptions\HttpResponseException;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class AuthService
{
    public function login(string $email, string $password): array
    {
        $user = User::whereEmail($email)->first();
        if (!$user || !Hash::check($password, $user->password)) {
            throw new HttpResponseException(response()->json([
                'success'   => false,
                'message'   => 'Validation errors',
                'data'      => __('auth.failed'),
            ], ResponseAlias::HTTP_UNPROCESSABLE_ENTITY));
        }

        return [
            'success'   => true,
            'type'      => 'Bearer',
            'token'     => $user->createToken('api')->plainTextToken,
            'user'      => new UserResource($user),
        ];
    }

    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }

    /**
     * @throws Throwable
     */
    public function register(string $username, string $email, string $birthday, string $password): void
    {
        $user = User::create([
            'username' => $username,
            'email' => $email,
            'birthday' => $birthday,
            'password' => Hash::make($password),
        ]);

        try {
            event(new Registered($user));
        } catch (\Exception $exception)  {
            dd($exception->getMessage());
        }
    }

    public function resetPasswordByEmail(string $email, string $password, string $passwordConfirmation, string $token): JsonResponse
    {
        $requestData = [
            'email' => $email,
            'password' => $password,
            'password_confirmation' => $passwordConfirmation,
            'token' => $token,
        ];

        $status = Password::reset(
            $requestData,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json(
                [
                    'success' => true,
                ]
            );
        } else {
            throw new HttpResponseException(response()->json([
                'success'   => false,
                'message'   => 'Validation errors',
                'data'      => __($status),
            ], ResponseAlias::HTTP_UNPROCESSABLE_ENTITY));
        }
    }
}
