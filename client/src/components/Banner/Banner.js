import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './Banner.css';
import banner1 from '../../../src/assets/banner/banner-2400-x-600.webp'
import banner2 from '../../../src/assets/banner/banner-summer-2400x600.webp'
const banners = [
  { id: 1, src: banner1, alt: "Banner hè rực rỡ 1" },
  { id: 2, src: banner2, alt: "Banner hè rực rỡ 2" },
];

export default function Banner() {
  return (
    <section className="container mb-4 px-0">
      <Swiper
        modules={[Navigation]}
        navigation
        loop
        slidesPerView={1}
        className="banner-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <img
              src={banner.src}
              alt={banner.alt}
              className="banner-img"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
