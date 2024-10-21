import React from "react";
import ProductBrowser from "../components/ProductBrowser";
import SimilarProductList from "../components/SimilarProductList";

function Home() {
    return (
        <div>
            <h1>Home Page</h1>
            <ProductBrowser/>
            <SimilarProductList/>
        </div>
    );
}

export default Home;