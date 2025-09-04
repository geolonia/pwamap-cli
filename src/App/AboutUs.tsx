import './AboutUs.scss'

const Content = () => {

  return (
    <div className="about-us">
      <div className="container">
        <div className="branding">
          <div className="image"><img src={`${process.env.PUBLIC_URL}/icon-pwamap.svg`} alt=""/></div>
          <div className="logo">Geolonia PWAマップ</div>
        </div>

        <p>Geolonia PWAマップは、CSV と GitHub でオリジナルの地図アプリを作成することができます。</p>
        <p>プログラムはオープンソースで公開しているため、自由にカスタマイズしてご利用いただけます。</p>
      </div>
    </div>
  );
};

export default Content;
