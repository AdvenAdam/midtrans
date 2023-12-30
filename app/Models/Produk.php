<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Produk extends Model
{
    use HasFactory;
    use HasUuids;

    /**
     * Get the Order from order_product.
     */
    public function Order(): BelongsToMany
    {
        return $this->belongsToMany(Order::class, 'order_produks', 'produk_id', 'order_id')->withPivot('quantity');
    }
}
