import InputModal from "@/Components/InputModal";
import { Navbar } from "@/Components/Navbar";
import PrimaryButton from "@/Components/PrimaryButton";
import Product from "@/Components/Product";
import { Head, router } from "@inertiajs/react";

export default function Dashboard(props) {
    return (
        <>
            <Head title="Dashboard" />
            <Navbar title="Vens" />
            <div className="bg-white shadow-sm sm:rounded-lg overflow-y-auto">
                <div className="p-10 flex justify-end">
                    <PrimaryButton
                        onClick={() =>
                            document.getElementById("my_modal_1").showModal()
                        }
                    >
                        ADD
                    </PrimaryButton>
                </div>
                <Product produks={props.produks} />
            </div>
            <InputModal id="my_modal_1" />
        </>
    );
}
