export interface HotelDetail {
  id: number;
  name: string;
  location: {
    distance_from_original_hotel: number;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  rating: number;
  price: {
    currency: string;
    total: number;
  };
}
