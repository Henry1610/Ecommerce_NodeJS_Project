import React from 'react';
import Banner from '../../../components/Banner/Banner';
import ReasonChoose from './ReasonChoose';
import MostSearch from './MostSearch';
import News from './News';
import OptionForU from './OptionForU';
import CategoryProductSection from './CategoryProductSection';
import BrandProductSection from './BrandProductSection';
import './Home.css'
function Home() {
    // const filteredProducts = activeTabCategories ? products.filter(p => p.category.name === activeTabCategories) : products;
    return (
        <div>
            <Banner />
            {/* Hot News  */}
            <News />
            {/* Option For You  */}
            {/* <OptionForU /> */}
            <CategoryProductSection />
            <BrandProductSection />
            {/* Reason */}
            <ReasonChoose />
            {/* Most Search */}
            <MostSearch />
        </div>
    )
}

export default Home