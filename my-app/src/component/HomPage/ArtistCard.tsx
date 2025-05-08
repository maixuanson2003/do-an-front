const ArtistCard = ({ artist }: any) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl flex flex-col items-center justify-center hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl">
      <img
        src={artist.image}
        alt={artist.name}
        className="w-48 h-48 rounded-full object-cover mb-4 border-4 border-gray-700"
      />
      <h2 className="text-xl font-semibold text-center text-white">
        {artist.name}
      </h2>
      <p className="text-gray-400 text-center">{artist.genre}</p>
    </div>
  );
};

export default ArtistCard;
