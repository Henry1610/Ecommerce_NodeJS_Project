import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './Banner.css';

const banners = [
  {
    id: 1,
    src: "https://storage.googleapis.com/a1aa/image/292d9d0e-3ccb-4937-2f9a-0e07884ea30e.jpg",
    alt: "Banner hè rực rỡ 1"
  },
  {
    id: 2,
    src: "https://storage.googleapis.com/a1aa/image/292d9d0e-3ccb-4937-2f9a-0e07884ea30e.jpg",
    alt: "Banner hè rực rỡ 2"
  },
  {
    id: 3,
    src: "https://storage.googleapis.com/a1aa/image/292d9d0e-3ccb-4937-2f9a-0e07884ea30e.jpg",
    alt: "Banner hè rực rỡ 3"
  }
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
