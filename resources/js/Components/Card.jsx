import { router } from "@inertiajs/react";
import { useState } from "react";

const Card = ({ data }) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleAddToCart = () => {
        try {
            setIsLoading(true);
            router.post("/AddToCart", data);
        } catch (error) {
            console.log(
                "🚀 ~ file: Card.jsx:9 ~ handleAddToCart ~ error:",
                error
            );
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="card w-96 h-full glass">
            <figure className="h-full">
                <img
                    src={`/storage/images/${data.image}`}
                    alt="car!"
                    className="w-full h-full object-cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{data.title}</h2>
                <p>{data.price}</p>

                <div className="card-actions justify-end">
                    <button
                        className="btn btn-primary"
                        onClick={handleAddToCart}
                        disabled={isLoading}
                    >
                        Buy!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;
