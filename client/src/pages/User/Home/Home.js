import React from 'react';
import Banner from '../../../components/Banner/Banner';
import ReasonChoose from './ReasonChoose';
import MostSearch from './MostSearch';
import News from './News';
import OptionForU from './OptionForU';
import './Home.css'
function Home() {
    // const filteredProducts = activeTabCategories ? products.filter(p => p.category.name === activeTabCategories) : products;
    return (
        <>
            <Banner />
            {/* Hot News  */}
            <News />
            {/* Option For You  */}
            <OptionForU />
            {/* Reason */}
            <ReasonChoose />
            {/* Most Search */}
            <MostSearch />
        </>
    )
}

export default Home