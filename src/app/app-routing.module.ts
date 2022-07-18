import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AbortionComponent } from './abortion/abortion.component';
import { AdvertiseComponent } from './advertise/advertise.component';
import { AmazonRingComponent } from './amazon-ring/amazon-ring.component';
import { AmazonComponent } from './amazon/amazon.component';
import { AMDComponent } from './amd/amd.component';
import { AngualrwebComponent } from './angualrweb/angualrweb.component';
import { AppleMacComponent } from './apple-mac/apple-mac.component';
import { AppleComponent } from './apple/apple.component';
import { BidenComponent } from './biden/biden.component';
import { BlockchainComponent } from './blockchain/blockchain.component';
import { BrazComponent } from './braz/braz.component';
import { CanadaComponent } from './canada/canada.component';
import { CartelComponent } from './cartel/cartel.component';
import { CathieWoodComponent } from './cathie-wood/cathie-wood.component';
import { Cent50Component } from './cent50/cent50.component';
import { CollegeDebtComponent } from './college-debt/college-debt.component';
import { ContactComponent } from './contact/contact.component';
import { ContributeComponent } from './contribute/contribute.component';
import { CookieComponent } from './cookie/cookie.component';
import { CovComponent } from './cov/cov.component';
import { CowboysComponent } from './cowboys/cowboys.component';
import { CsharpComponent } from './csharp/csharp.component';
import { CsssComponent } from './csss/csss.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeoComponent } from './deo/deo.component';
import { DmxComponent } from './dmx/dmx.component';
import { DoomComponent } from './doom/doom.component';
import { DuaneWadeComponent } from './duane-wade/duane-wade.component';
import { EgyComponent } from './egy/egy.component';
import { ElonMuskComponent } from './elon-musk/elon-musk.component';
import { FacebookMetaComponent } from './facebook-meta/facebook-meta.component';
import { FacebookReactComponent } from './facebook-react/facebook-react.component';
import { FacebookZuckComponent } from './facebook-zuck/facebook-zuck.component';
import { FauciComponent } from './fauci/fauci.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FigmaComponent } from './figma/figma.component';
import { FlutterComponent } from './flutter/flutter.component';
import { FooterGamingComponent } from './footer-gaming/footer-gaming.component';
import { FooterComponent } from './footer/footer.component';
import { FortniteComponent } from './fortnite/fortnite.component';
import { GasComponent } from './gas/gas.component';
import { GearsComponent } from './gears/gears.component';
import { GeraldLevertComponent } from './gerald-levert/gerald-levert.component';
import { GodOfWarComponent } from './god-of-war/god-of-war.component';
import { GoogleComponent } from './google/google.component';
import { HockeyComponent } from './hockey/hockey.component';
import { HtmllComponent } from './htmll/htmll.component';
import { IntelComponent } from './intel/intel.component';
import { JaneComponent } from './jane/jane.component';
import { JavaComponent } from './java/java.component';
import { KeithsweatComponent } from './keithsweat/keithsweat.component';
import { KenyaComponent } from './kenya/kenya.component';
import { LebronJamesComponent } from './lebron-james/lebron-james.component';
import { MacorComponent } from './macor/macor.component';
import { MariahCareyComponent } from './mariah-carey/mariah-carey.component';
import { MichaelJacksonComponent } from './michael-jackson/michael-jackson.component';
import { MichaelJordanComponent } from './michael-jordan/michael-jordan.component';
import { MicrosoftWindowsComponent } from './microsoft-windows/microsoft-windows.component';
import { MicrosoftComponent } from './microsoft/microsoft.component';
import { MitchComponent } from './mitch/mitch.component';
import { MusicComponent } from './music/music.component';
import { NintendoComponent } from './nintendo/nintendo.component';
import { NopageComponent } from './nopage/nopage.component';
import { NvidiaComponent } from './nvidia/nvidia.component';
import { PeloComponent } from './pelo/pelo.component';
import { PjComponent } from './pj/pj.component';
import { PlaystationHorizonComponent } from './playstation-horizon/playstation-horizon.component';
import { PlaystationComponent } from './playstation/playstation.component';
import { PolandComponent } from './poland/poland.component';
import { PoliticTalksComponent } from './politic-talks/politic-talks.component';
import { PoliticsComponent } from './politics/politics.component';
import { PowersupplyComponent } from './powersupply/powersupply.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { PutinComponent } from './putin/putin.component';
import { PythonComponent } from './python/python.component';
import { RazerComponent } from './razer/razer.component';
import { RkellyComponent } from './rkelly/rkelly.component';
import { SketchComponent } from './sketch/sketch.component';
import { SportsComponent } from './sports/sports.component';
import { StockComponent } from './stock/stock.component';
import { SupremeComponent } from './supreme/supreme.component';
import { TechnologyComponent } from './technology/technology.component';
import { TermsComponent } from './terms/terms.component';
import { TexasShootingsComponent } from './texas-shootings/texas-shootings.component';
import { TiktokComponent } from './tiktok/tiktok.component';
import { TomBradyComponent } from './tom-brady/tom-brady.component';
import { TrumpComponent } from './trump/trump.component';
import { Trump1Component } from './trump1/trump1.component';
import { TwitterComponent } from './twitter/twitter.component';
import { UkComponent } from './uk/uk.component';
import { UkrainComponent } from './ukrain/ukrain.component';
import { VenComponent } from './ven/ven.component';
import { VoteComponent } from './vote/vote.component';
import { VueComponent } from './vue/vue.component';
import { WhitneyHoustonComponent } from './whitney-houston/whitney-houston.component';
import { XIComponent } from './xi/xi.component';

const routes: Routes = [

  {path: '', component: DashboardComponent},
  {path: 'home',title:'iTruth News/Dashboard', component: DashboardComponent},
  {path: 'technology', title:'iTruth News/Technology',component: TechnologyComponent},
  {path: 'politics', title:'iTruth News/Politics',component: PoliticsComponent},
  {path: 'music', title:'iTruth News/Music' ,component: MusicComponent},
  {path: 'sports', title:'iTruth News/Sports' ,component: SportsComponent},
  //navbar routes stops here

 
{path: 'apple', title:'iTruth News/Technology/Apple', component: AppleComponent},
//top news

{path: 'keithsweat',title:'iTruth News/Music/Keith Sweat' ,component: KeithsweatComponent},
{path:'jane', title:'iTruth News/Fashion/Jane', component: JaneComponent},
{path: 'cov', title:'iTruth News/World News/Covid', component:CovComponent},
{path: 'XI', title:'iTruth News/Asia News/China', component:XIComponent},
{path: 'stock', title:'iTruth News/Finance/Wall Street', component:StockComponent},
//headline news row of dashboard routes stops here


{path: 'flutter', title:'iTruth News/Technology/Flutter', component: FlutterComponent},
{path: 'playstation', title:'iTruth News/Technology/Gaming/Playstaion', component: PlaystationComponent},
{path: 'aws', title:'iTruth News/Technology/AWS', component:AmazonComponent},
{path: 'google', title:'iTruth News/Technology/Google', component:GoogleComponent},
{path: 'microsoft', title:'iTruth News/Technology/Microsoft', component:MicrosoftComponent},
//tech row of dashboard routes stops here


{path: 'putin', title: 'iTruth News/Politics/Russia', component: PutinComponent},
{path: 'biden', title: 'iTruth News/Politics/Biden', component: BidenComponent},
{path: 'Mitch', title: 'iTruth News/Politics/McCooner', component: MitchComponent},
{path: 'fauci', title: 'iTruth News/Politics/Fauci', component: FauciComponent},
{path: 'macor', title: 'iTruth News/Politics/Macor', component: MacorComponent},
//politics row of dashboard routes stops here


{path: 'vote', title: 'iTruth News/Opinions/Vote', component: VoteComponent},
{path: 'trump', title: 'iTruth News/Opinions/Trump', component: TrumpComponent},
{path: 'student-debt', title: 'iTruth News/Opinions/Education', component: CollegeDebtComponent},
{path: 'tom-brady', title: 'iTruth News/Opinions/Sports', component: TomBradyComponent},
{path: 'cathie-wood', title: 'iTruth News/Opinions/Finance', component: CathieWoodComponent},
//opinion row of dashboard routes stops here

{path:'Rkelly', title: 'iTruth News/Music/Rkelly', component: RkellyComponent},
{path:'Whitney-Houston', title: 'iTruth News/Music/Whitney-Houston', component: WhitneyHoustonComponent},
{path:'Mariah-Carey', title: 'iTruth News/Music/Mariah-Carey', component: MariahCareyComponent},
{path:'Gerald-Levert', title: 'iTruth News/Music/Gerald-Levert', component: GeraldLevertComponent},
{path:'Michael-Jackson', title: 'iTruth News/Music/Michael-Jackson', component: MichaelJacksonComponent},
//music row of dashboard routes stops here


{path:'Michael-Jordan', title: 'iTruth News/Sports/Michael-Jordan', component: MichaelJordanComponent},
{path:'Lebron-James', title: 'iTruth News/Sports/Lebron-James', component: LebronJamesComponent},
{path:'Cowboys', title: 'iTruth News/Sports/Cowboys', component: CowboysComponent},
{path:'Duane-Wade', title: 'iTruth News/Sports/Duane-Wade', component: DuaneWadeComponent},
{path:'Hockey', title: 'iTruth News/Sports/Hockey', component: HockeyComponent},
//sports row of dashboard routes stops here

  
  
  
//technology page routes
{path:'Macbook', title:'iTruth News/Technology/Apple/MacBook',component:AppleMacComponent},

//headline tech route news
{path:'Metaverse', title:'iTruth News/Technology/Facebook/Metaverse',component:FacebookMetaComponent},
{path:'Blockchain', title:'iTruth News/Technology/Blockchain',component:BlockchainComponent},
{path:'Nintendo', title:'iTruth News/Technology/Gaming',component:NintendoComponent},
{path:'Windows', title:'iTruth News/Technology/Microsoft',component:MicrosoftWindowsComponent},
{path:'React', title:'iTruth News/Technology/Fcaebook/React',component: FacebookReactComponent},
//headline tech route news

//opinion tech routes
{path: 'Zuckerberg', title: 'iTruth News/Technology/Facebook', component: FacebookZuckComponent},
{path: 'Amazon-Ring', title: 'iTruth News/Technology/Amazon', component: AmazonRingComponent},
{path: 'TikTok', title: 'iTruth News/Technology/Tiktok', component: TiktokComponent},
{path: 'Twitter', title: 'iTruth News/Technology/Twitter', component: TwitterComponent},
{path: 'Musk', title: 'iTruth News/Technology/Elon-Musk', component: ElonMuskComponent},
//opinion tech routes

//gaming tech routes
{path: 'Horizon-Forbidden-West', title: 'iTruth News/Technology/Gaming/Playstation',component: PlaystationHorizonComponent},
{path: 'Fortnite', title: 'iTruth News/Technology/Gaming',component: FortniteComponent},
{path: 'Doom', title: 'iTruth News/Technology/Gaming',component: DoomComponent},
{path: 'Gears', title: 'iTruth News/Technology/Gaming/Microsoft',component: GearsComponent},
{path: 'God-of-War', title: 'iTruth News/Technology/Gaming/Playstation',component: GodOfWarComponent},
//gaming tech routes

//PC tech routes
{path:'GPUshort', title:'iTruth News/Technology/PC', component: NvidiaComponent},
{path:'Powersupply', title:'iTruth News/Technology/PC', component: PowersupplyComponent},
{path:'Ryzen', title:'iTruth News/Technology/PC/AMD/CPU', component: AMDComponent,},
{path:'IntelEvo', title:'iTruth News/Technology/PC/Intel/CPU', component: IntelComponent,},
{path:'RazerRaptor', title:'iTruth News/Technology/PC', component: RazerComponent,},
//PC tech routes

//web development tech routes
{path: 'Angular', title: 'iTruth News/Technology/Web Development', component: AngualrwebComponent},
{path: 'Vue', title: 'iTruth News/Technology/Web Development', component: VueComponent},
{path: 'Python', title: 'iTruth News/Technology/Web Development', component: PythonComponent},
{path: 'JAVA', title: 'iTruth News/Technology/Web Development', component: JavaComponent},
{path: 'C#', title: 'iTruth News/Technology/Web Development', component: CsharpComponent},
//web development tech routes

//web development tech routes
{path: 'Figma', title: 'iTruth News/Technology/UI/UX', component: FigmaComponent},
{path: 'HTML', title: 'iTruth News/Technology/UI/UX', component: HtmllComponent},
{path: 'Sketch', title: 'iTruth News/Technology/UI/UX', component: SketchComponent},
{path: 'AdobeXD', title: 'iTruth News/Technology/UI/UX', component: SketchComponent},
{path: 'CSS3', title: 'iTruth News/Technology/UI/UX', component: CsssComponent},
//UI/UX tech routes

//technology page routes
  
  
//politics page routes
{path: 'Abortion', title: 'iTruth News/Politics', component: AbortionComponent},

//headline politics routes
{path: 'Politics', title: 'iTruth News/Politics', component: PoliticTalksComponent},
{path: 'Supreme', title: 'iTruth News/Politics', component: SupremeComponent},
{path: 'Pelosi', title: 'iTruth News/Politics', component: PeloComponent},
{path: 'Ukrain', title: 'iTruth News/World News/Ukrain', component: UkrainComponent},
{path: 'Canada', title: 'iTruth News/World News/Canada', component: CanadaComponent},
//headline politics routes


//opinion news routes
{path:'Opinion/Poland', title: 'iTruth News/World News/Poland', component: PolandComponent},
{path:'Opinion/Texas', title: 'iTruth News/Politics/Texas', component: TexasShootingsComponent},
{path:'Opinion/Gas', title: 'iTruth News/Politics/Gas', component: GasComponent},
{path:'Opinion/Trump', title: 'iTruth News/Politics/Gas', component: Trump1Component},
{path:'Opinion/Kenya', title: 'iTruth News/World News/Kenya', component: KenyaComponent},
//opinion news routes

//world news routes
{path: 'Cartel', title: 'iTruth News/World News/Mexico', component: CartelComponent},
{path: 'Venezuala', title: 'iTruth News/World News/South America', component: VenComponent},
{path: 'Brazil', title: 'iTruth News/World News/South America', component: BrazComponent},
{path: 'London', title: 'iTruth News/World News/Europe', component: UkComponent},
{path: 'Egypt', title: 'iTruth News/World News/Asia', component: EgyComponent},
//world news routes
//politics page routes

//Music page routes
{path: 'DMX', title: 'iTruth News/Music/Hip-Hop', component: DmxComponent},

//Music headline Page Routes
{path: '50', title: 'iTruth News/Music/Hip-Hop', component: Cent50Component},
//Music headline Page Routes
//Music page routes


//Sports page routes
{path: 'Deion', title: 'iTruth News/Sports/Football', component: DeoComponent},



//Sports headline routes
{path: 'PJ', title: 'iTruth News/Sports/Baskball', component: PjComponent},
//Sports headline routes
//Sports page routes
  
  
  
  //footer routes
  {path: 'gaming', title: 'iTruth News/Gaming', component: FooterGamingComponent},
  {path: 'contribute', title:'iTruth News/Contribute',component: ContributeComponent},
  {path: 'contact', title:'Contact iTruth News',component: ContactComponent},
  {path: 'advertise', title:'Business/iTruth News',component: AdvertiseComponent},
  {path: 'terms-of-use', title:'iTruth News Terms of Use | iTruth News Legel',component: TermsComponent},
  {path: 'cookie', title:'iTruth News Cookie Policies',component: CookieComponent},
  {path: 'privacy', title:'iTruth News Privacy Policies',component: PrivacyComponent},
  {path: 'feedback', title:'Your feedback matters to iTruth News',component: FeedbackComponent},
//footer routes

{path: '**', title:'404',component: NopageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
