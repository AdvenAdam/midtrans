<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Order extends Model
{
    use HasFactory;
    use HasUuids;
    protected $fillable = [
        'status', 'total'
    ];

    /**
     * Get the product from product_order.
     */
    public function Produk(): BelongsToMany
    {
        return $this->belongsToMany(Produk::class, 'order_produks', 'order_id', 'produk_id')->withPivot('quantity');
    }
}
