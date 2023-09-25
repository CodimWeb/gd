<?php

namespace App\Models;

use Eloquent;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

/**
 * App\Models\User
 *
 * @property int $id
 * @property string $username
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property Carbon $birthday
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $country_id
 * @property string|null $biography
 * @property string|null $avatar
 * @property-read Collection<int, \App\Models\Chat> $chatsOne
 * @property-read int|null $chats_one_count
 * @property-read Collection<int, \App\Models\Chat> $chatsTwo
 * @property-read int|null $chats_two_count
 * @property-read \App\Models\Country|null $country
 * @property-read Collection<int, \App\Models\ChatMessage> $messages
 * @property-read int|null $messages_count
 * @property-read Collection<int, \App\Models\Notification> $notifications
 * @property-read int|null $notifications_count
 * @property-read Collection<int, \App\Models\Offer> $offers
 * @property-read int|null $offers_count
 * @property-read Collection<int, \App\Models\Task> $tasks
 * @property-read int|null $tasks_count
 * @property-read Collection<int, PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static Builder|User newModelQuery()
 * @method static Builder|User newQuery()
 * @method static Builder|User query()
 * @method static Builder|User whereAvatar($value)
 * @method static Builder|User whereBiography($value)
 * @method static Builder|User whereBirthday($value)
 * @method static Builder|User whereCountryId($value)
 * @method static Builder|User whereCreatedAt($value)
 * @method static Builder|User whereEmail($value)
 * @method static Builder|User whereEmailVerifiedAt($value)
 * @method static Builder|User whereId($value)
 * @method static Builder|User wherePassword($value)
 * @method static Builder|User whereRememberToken($value)
 * @method static Builder|User whereUpdatedAt($value)
 * @method static Builder|User whereUsername($value)
 * @mixin Eloquent
 */
class User extends Authenticatable implements MustVerifyEmail, CanResetPasswordContract
{
    use CanResetPassword;
    use HasApiTokens;
    use HasFactory;
    use Notifiable;

    const LOCAL_AVATAR_PATH = 'storage' . DIRECTORY_SEPARATOR . 'users';

    protected $fillable = [
        'username',
        'email',
        'email_verified_at',
        'password',
        'birthday',
        'avatar',
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected $casts = [
        'email_verified_at' => 'datetime',
        'birthday' => 'date',
    ];

    public function country(): HasOne
    {
        return $this->hasOne(Country::class, 'id', 'country_id');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'user_id', 'id');
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class, 'user_id', 'id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id', 'id');
    }

    public function chatsOne(): HasMany
    {
        return $this->hasMany(Chat::class, 'user_one', 'id');
    }

    public function chatsTwo(): HasMany
    {
        return $this->hasMany(Chat::class, 'user_two', 'id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class, 'user_id', 'id');
    }
}
