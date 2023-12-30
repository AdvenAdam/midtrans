import Card from "./Card";

const Product = ({ produks }) => {
    console.log("🚀 ~ file: Product.jsx:4 ~ Product ~ produks:", produks);

    const Produks = ({ lists }) =>
        lists.map((list, index) => (
            <div key={index} className="flex justify-center items-center">
                <Card data={list} />
            </div>
        ));

    return (
        <div className="grid h-full w-full grid-cols-4 p-10">
            <Produks lists={produks} />
        </div>
    );
};

export default Product;
