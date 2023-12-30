<?php

namespace App\Http\Controllers;

use App\Models\order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct()
    {
        \Midtrans\Config::$serverKey    = config('services.midtrans.serverKey');
        \Midtrans\Config::$isProduction = config('services.midtrans.isProduction');
        \Midtrans\Config::$isSanitized  = config('services.midtrans.isSanitized');
        \Midtrans\Config::$is3ds        = config('services.midtrans.is3ds');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //  REVIEW UNPAID SELALU 1 DATA
        $ordersWithProducts = Order::with('produk')->where('status', 'UNPAID')->first();
        if (!$ordersWithProducts) {
            return redirect()->back()->with('message', 'Cart is empty');
        }
        return Inertia::render('Cart', [
            'orders' => $ordersWithProducts,
            'produks' => $ordersWithProducts->Produk()->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $ordersWithProducts = Order::with('produk')->where('status', 'UNPAID')->first();
            $produkId = $request->id;
            if (!$ordersWithProducts) {
                $newOrder = new Order();
                $newOrder->total = $request->price;
                $newOrder->status = 'UNPAID';
                $newOrder->save();
                $ordersWithProducts = Order::with('produk')->where('status', 'UNPAID')->first();
            } else {
                $ordersWithProducts->total += $request->price;
                $ordersWithProducts->save();
            }
            if ($ordersWithProducts->Produk()->find($produkId)) {
                $quantity = $ordersWithProducts->Produk()->find($produkId)->pivot->quantity + 1;
                $ordersWithProducts->Produk()->updateExistingPivot($produkId, ['quantity' => $quantity]);
            } else {
                $ordersWithProducts->Produk()->attach($produkId, ['quantity' => 1]);
            }
            DB::commit();

            return redirect()->back()->with('message', 'Success save data !!');
        } catch (\Throwable $th) {
            throw $th;
            DB::rollBack();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, order $order, $id)
    {
        // TODO: UPDATE DATA & MIDTRANS INTEGRATE
        try {
            DB::beginTransaction();
            $item_details = [];
            foreach ($request->produks as $produk) {
                $item_details[] = [
                    'id'       => $produk['id'],
                    'price'    => $produk['price'],
                    'quantity' => $produk['pivot']['quantity'],
                    'name'     => $produk['title'],
                ];
            }
            $payload = [
                'transaction_details' => [
                    'order_id'     => $id,
                    'gross_amount' => $order->total,
                ],
                'customer_details' => [
                    'first_name' => 'Dummy',
                    'email'      => 'Dummy@mail.com',
                ],
                'item_details' => $item_details

            ];
            $snapToken = \Midtrans\Snap::getSnapToken($payload);
            $paymentUrl = \Midtrans\Snap::getSnapUrl($payload);
            $order::where('id', $id)
                ->where('status', 'UNPAID')
                ->update(['snap_token' => $snapToken, 'status' => 'PAID']);
            DB::commit();
            return Inertia::location($paymentUrl);
        } catch (\Throwable $th) {
            throw $th;
            DB::rollBack();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(order $order)
    {
        //
    }
}
