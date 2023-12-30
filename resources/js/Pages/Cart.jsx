import { Navbar } from "@/Components/Navbar";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";

export default function Cart(props) {
    const initialState = {
        orders: props.orders,
        produks: props.produks,
    };
    const [data, setData] = useState(initialState);
    console.log("🚀 ~ file: Cart.jsx:11 ~ Cart ~ data:", data);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handles the quantity of a product based on the given id and action.
     *
     * @param {string} id - The id of the product.
     * @param {string} action - The action to perform on the quantity ("plus" or "minus").
     */
    const handleQuantity = (id, action) => {
        const filteredProduk = data.produks.filter(
            (produk) => produk.id === id
        );
        const quantityProduk = filteredProduk[0].pivot.quantity;
        const priceProduk = filteredProduk[0].price;
        const orderTotal =
            action === "plus"
                ? Number(data.orders.total) + Number(priceProduk)
                : Number(data.orders.total) - Number(priceProduk);

        const updatedProduks = data.produks.map((produk) => {
            if (produk.id === id) {
                return {
                    ...produk,
                    pivot: {
                        ...produk.pivot,
                        quantity:
                            action === "plus"
                                ? quantityProduk + 1
                                : quantityProduk - 1,
                    },
                };
            }
            return produk;
        });

        setData((prevData) => ({
            ...prevData,
            orders: {
                ...prevData.orders,
                total: orderTotal,
            },
            produks: updatedProduks,
        }));
    };

    /**
     * Handles the form submission with the given ID.
     *
     * @param {type} id - The ID of the form.
     * @return {type} No return value.
     */
    const handleSubmit = (id) => {
        try {
            setIsLoading(true);
            router.post(`/checkout/${id}`, data);
        } catch (error) {
            console.log(
                "🚀 ~ file: InputModal.jsx:32 ~ handleSubmit ~ error:",
                error
            );
        } finally {
            setIsLoading(false);
        }
    };

    const ProdukList = ({ lists }) =>
        lists.map((list, index) => (
            <div className="mt-8" key={index}>
                <div className="flex flex-col md:flex-row border-b border-gray-400 py-4">
                    <div className="flex-shrink-0">
                        <img
                            src={`/storage/images/${list.image}`}
                            alt="Product image"
                            className="w-32 h-32 object-cover"
                        />
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6">
                        <h2 className="text-lg font-bold">{list.title}</h2>
                        <p className="mt-2 text-gray-600">
                            {list.price * list.pivot.quantity}
                        </p>
                        <div className="mt-4 flex items-center">
                            <span className="mr-2 text-gray-600">
                                Quantity:
                            </span>
                            <div className="flex items-center">
                                <button
                                    className="bg-gray-200 rounded-l-lg px-2 py-1"
                                    onClick={() =>
                                        handleQuantity(list.id, "minus")
                                    }
                                >
                                    -
                                </button>
                                <span className="mx-2 text-gray-600">
                                    {list.pivot.quantity}
                                </span>
                                <button
                                    className="bg-gray-200 rounded-r-lg px-2 py-1"
                                    onClick={() =>
                                        handleQuantity(list.id, "plus")
                                    }
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ));

    return (
        <>
            <Head title="Dashboard" />
            <Navbar title="Vens" />
            <div className="bg-white shadow-sm sm:rounded-lg overflow-y-auto">
                <div className="overflow-x-auto">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <h1 className="text-2xl font-bold my-4">
                                Shopping Cart
                            </h1>
                            <button
                                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => handleSubmit(data.orders.id)}
                                disabled={isLoading}
                            >
                                Checkout
                            </button>
                        </div>
                        <ProdukList lists={data.produks} />

                        <div className="flex justify-end items-center mt-8">
                            <span className="text-gray-600 mr-4">
                                Subtotal:
                            </span>
                            <span className="text-xl font-bold">
                                {data.orders.total}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
