import s from './MainPageComp.module.scss';

function MainPageComp() {
  return (
    <div className={s.Container}>
      <div className={s.FirstContainer}>
        <div className={s.textContainer}>
          <h1>Логистика, основанная на <br />доверии. Качество, <br />воплощенное в совершенстве.</h1>
        </div>
      </div>
      <div className={s.FirstMiniContainer}>
        <p>Наша логистическая компания, работающая на базе активов, стремится обеспечить <br/>надежные и устойчивые решения для своих клиентов. Используя широкую базу ресурсов, <br/>технологий и опыта, мы предлагаем полный набор логистических услуг, позволяющих <br/>нашим клиентам уверенно достигать поставленных целей.</p>
      </div>
      <div className={s.SecondContainer}>
        
      </div>
    </div>
    
  );
}

export default MainPageComp;