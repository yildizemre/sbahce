import { useState, useEffect } from 'react';
import { Phone, ChevronLeft, Home, MapPin, Building2, ChevronRight, Leaf } from 'lucide-react';

interface Resident {
  name: string;
  phone: string;
}

interface Apartment {
  id: number;
  number: number;
  floor: number;
  resident: Resident;
}

interface Block {
  id: string;
  name: string;
  apartments: Apartment[];
}

const generateBlock = (blockId: string, blockName: string): Block => {
  const namePool: Record<string, string[]> = {
    A: [
      'Ahmet Yılmaz', 'Mehmet Demir', 'Mustafa Kaya', 'Ali Şahin',
      'Hüseyin Çelik', 'İbrahim Arslan', 'Ömer Doğan', 'Yusuf Aydın',
      'Hasan Koç', 'Kemal Erdoğan', 'Serdar Özdemir', 'Taner Bulut',
      'Halil Güneş', 'Ersin Kaplan', 'Onur Demirtaş', 'Suat Çakır',
      'Mert Avcı', 'Ufuk Yıldırım', 'Berk Tuncer', 'Sinan Doğru',
    ],
    B: [
      'Serkan Aktaş', 'Burak Özkan', 'Emre Polat', 'Tolga Güler',
      'Oğuz Yıldız', 'Cem Çetin', 'Barış Kurt', 'Murat Bozkurt',
      'Selim Acar', 'Alp Tunç', 'Fatih Kılıç', 'Engin Sarı',
      'Volkan Gürel', 'Cihan Öztürk', 'Kadir Aslan', 'Levent Dinç',
      'Tarık Şen', 'Cenk Yavuz', 'Orhan Kara', 'Erdal Toprak',
    ],
  };

  const phoneBases: Record<string, string[]> = {
    A: [
      '05321110001','05331110002','05341110003','05351110004',
      '05361110005','05371110006','05381110007','05391110008',
      '05321110009','05331110010','05341110011','05351110012',
      '05361110013','05371110014','05381110015','05391110016',
      '05321110017','05331110018','05341110019','05351110020',
    ],
    B: [
      '05322220001','05332220002','05342220003','05352220004',
      '05362220005','05372220006','05382220007','05392220008',
      '05322220009','05332220010','05342220011','05352220012',
      '05362220013','05372220014','05382220015','05392220016',
      '05322220017','05332220018','05342220019','05352220020',
    ],
  };

  const apartments: Apartment[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    floor: Math.floor(i / 2) + 1,
    resident: { name: namePool[blockId][i], phone: `+9${phoneBases[blockId][i]}` },
  }));

  return { id: blockId, name: blockName, apartments };
};

const blocks: Block[] = [
  generateBlock('A', 'A Blok'),
  generateBlock('B', 'B Blok'),
];

type Screen = 'welcome' | 'apartments' | 'residents';

function useEntrance() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 40);
    return () => clearTimeout(t);
  }, []);
  return ready;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [leaving, setLeaving] = useState(false);

  const go = (to: Screen, cb?: () => void) => {
    setLeaving(true);
    setTimeout(() => {
      cb?.();
      setScreen(to);
      setLeaving(false);
    }, 260);
  };

  const selectBlock = (block: Block) => go('apartments', () => setSelectedBlock(block));
  const selectApartment = (apt: Apartment) => go('residents', () => setSelectedApartment(apt));
  const goBack = () => {
    if (screen === 'residents') go('apartments');
    else if (screen === 'apartments') go('welcome');
  };

  const floorGroups = selectedBlock
    ? selectedBlock.apartments.reduce<Record<number, Apartment[]>>((acc, apt) => {
        if (!acc[apt.floor]) acc[apt.floor] = [];
        acc[apt.floor].push(apt);
        return acc;
      }, {})
    : {};

  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(160deg, #0a1812 0%, #0f1f18 40%, #162d20 100%)',
        overflowX: 'hidden',
      }}
    >
      {/* Ambient blobs — fixed, non-interactive */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute rounded-full"
          style={{
            top: '-80px', right: '-80px',
            width: '55vw', height: '55vw',
            maxWidth: 280, maxHeight: 280,
            background: 'radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: '45%', left: '-60px',
            width: '45vw', height: '45vw',
            maxWidth: 200, maxHeight: 200,
            background: 'radial-gradient(circle, rgba(132,204,22,0.09) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: '-60px', right: '15%',
            width: '50vw', height: '50vw',
            maxWidth: 220, maxHeight: 220,
            background: 'radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Header */}
      <header
        className="relative flex-shrink-0"
        style={{
          zIndex: 10,
          paddingTop: 'max(env(safe-area-inset-top), 16px)',
          paddingLeft: 'max(env(safe-area-inset-left), 20px)',
          paddingRight: 'max(env(safe-area-inset-right), 20px)',
          paddingBottom: '8px',
        }}
      >
        <div className="flex items-center justify-between">
          {screen !== 'welcome' ? (
            <button
              onClick={goBack}
              className="flex items-center gap-1 font-semibold"
              style={{
                color: '#4ade80',
                fontSize: '15px',
                minHeight: '44px',
                paddingRight: '12px',
              }}
            >
              <ChevronLeft style={{ width: 20, height: 20 }} />
              Geri
            </button>
          ) : (
            <div style={{ width: 60 }} />
          )}

          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 34, height: 34,
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                boxShadow: '0 4px 12px rgba(34,197,94,0.35)',
              }}
            >
              <Leaf style={{ width: 16, height: 16, color: 'white' }} />
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '15px', letterSpacing: '0.02em' }}>
              Karmir Life
            </span>
          </div>

          <div style={{ width: 60 }} />
        </div>
      </header>

      {/* Scrollable content */}
      <div
        className="relative flex-1"
        style={{
          zIndex: 5,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          opacity: leaving ? 0 : 1,
          transform: leaving ? 'translateY(10px)' : 'translateY(0)',
          transition: 'opacity 0.26s ease, transform 0.26s ease',
        }}
      >
        <div
          style={{
            paddingLeft: 'max(env(safe-area-inset-left), 20px)',
            paddingRight: 'max(env(safe-area-inset-right), 20px)',
            paddingBottom: 'max(env(safe-area-inset-bottom), 32px)',
          }}
        >
          {screen === 'welcome' && <WelcomeScreen onSelectBlock={selectBlock} />}
          {screen === 'apartments' && selectedBlock && (
            <ApartmentsScreen
              block={selectedBlock}
              floorGroups={floorGroups}
              onSelectApartment={selectApartment}
            />
          )}
          {screen === 'residents' && selectedApartment && selectedBlock && (
            <ResidentsScreen block={selectedBlock} apartment={selectedApartment} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Welcome ─────────────────────────────────────────────── */
function WelcomeScreen({ onSelectBlock }: { onSelectBlock: (block: Block) => void }) {
  const ready = useEntrance();
  return (
    <div
      style={{
        opacity: ready ? 1 : 0,
        transform: ready ? 'none' : 'translateY(18px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      {/* Hero */}
      <div className="text-center" style={{ paddingTop: '8vw', paddingBottom: '6vw' }}>
        <div
          className="inline-flex items-center gap-1.5 rounded-full font-semibold uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.1em',
            padding: '6px 14px',
            marginBottom: '20px',
            background: 'rgba(34,197,94,0.12)',
            color: '#4ade80',
            border: '1px solid rgba(34,197,94,0.2)',
          }}
        >
          <MapPin style={{ width: 12, height: 12 }} />
          Misafir Erişim Paneli
        </div>

        <h1
          style={{
            color: 'white',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '12px',
            fontSize: 'clamp(1.75rem, 9vw, 2.5rem)',
          }}
        >
          Karmir Life
          <br />
          <span
            style={{
              background: 'linear-gradient(90deg, #4ade80, #a3e635)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Sitesine Hoş Geldiniz
          </span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', lineHeight: 1.5 }}>
          Lütfen gitmek istediğiniz bloğu seçin
        </p>
      </div>

      {/* Block cards */}
      <div className="grid grid-cols-2" style={{ gap: '14px' }}>
        {blocks.map((block, i) => (
          <BlockCard key={block.id} block={block} index={i} onSelect={onSelectBlock} />
        ))}
      </div>

      <p
        className="text-center"
        style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '32px', lineHeight: 1.6 }}
      >
        Gitmek istediğiniz bloğu seçerek<br />görevliyi arayabilirsiniz.
      </p>
    </div>
  );
}

function BlockCard({ block, index, onSelect }: { block: Block; index: number; onSelect: (b: Block) => void }) {
  const [pressed, setPressed] = useState(false);
  const cfg = [
    { from: '#052e16', to: '#166534', ring: 'rgba(34,197,94,0.3)', dot: '#4ade80' },
    { from: '#3b1a04', to: '#92400e', ring: 'rgba(217,119,6,0.3)', dot: '#fbbf24' },
  ];
  const c = cfg[index];

  return (
    <button
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={() => onSelect(block)}
      className="relative overflow-hidden rounded-3xl text-left w-full"
      style={{
        background: `linear-gradient(160deg, ${c.from} 0%, ${c.to} 100%)`,
        border: `1px solid ${c.ring}`,
        boxShadow: pressed ? 'none' : `0 16px 36px -8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)`,
        transform: pressed ? 'scale(0.94)' : 'scale(1)',
        transition: 'transform 0.14s ease, box-shadow 0.14s ease',
        padding: '20px 16px 20px 18px',
        minHeight: '170px',
      }}
    >
      {/* Top shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 75% 10%, rgba(255,255,255,0.15) 0%, transparent 60%)' }}
      />
      <Building2 style={{ width: 26, height: 26, color: c.dot, opacity: 0.85, marginBottom: '16px' }} />
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        Blok
      </div>
      <div style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(2.5rem, 14vw, 3.5rem)', lineHeight: 1 }}>
        {block.id}
      </div>
      <div
        className="flex items-center justify-between"
        style={{ marginTop: '14px' }}
      >
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>20 Daire · 10 Kat</span>
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.1)' }}
        >
          <ChevronRight style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.65)' }} />
        </div>
      </div>
    </button>
  );
}

/* ─── Apartments ──────────────────────────────────────────── */
function ApartmentsScreen({
  block,
  floorGroups,
  onSelectApartment,
}: {
  block: Block;
  floorGroups: Record<number, Apartment[]>;
  onSelectApartment: (apt: Apartment) => void;
}) {
  const ready = useEntrance();
  return (
    <div
      style={{
        opacity: ready ? 1 : 0,
        transform: ready ? 'none' : 'translateY(18px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      <div style={{ paddingTop: '20px', paddingBottom: '24px' }}>
        <div
          className="inline-flex items-center gap-1.5 rounded-full font-semibold"
          style={{
            fontSize: '11px', letterSpacing: '0.08em',
            padding: '5px 12px', marginBottom: '14px',
            background: 'rgba(34,197,94,0.12)', color: '#4ade80',
            border: '1px solid rgba(34,197,94,0.18)',
          }}
        >
          <Building2 style={{ width: 11, height: 11 }} />
          {block.name}
        </div>
        <h2 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.6rem, 7vw, 2rem)', marginBottom: '4px' }}>
          Daire Seçin
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '14px' }}>
          Gitmek istediğiniz daireye dokunun
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Object.entries(floorGroups)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([floor, apts]) => (
            <div key={floor}>
              <div className="flex items-center gap-3" style={{ marginBottom: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {floor}. Kat
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              </div>
              <div className="grid grid-cols-2" style={{ gap: '10px' }}>
                {apts.map((apt) => (
                  <ApartmentCard key={apt.id} apt={apt} onSelect={onSelectApartment} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function ApartmentCard({ apt, onSelect }: { apt: Apartment; onSelect: (a: Apartment) => void }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={() => onSelect(apt)}
      className="relative overflow-hidden rounded-2xl text-left w-full"
      style={{
        background: pressed ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.09)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: pressed ? 'none' : '0 4px 20px rgba(0,0,0,0.3)',
        transform: pressed ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.13s ease',
        padding: '16px 14px',
        minHeight: '100px',
      }}
    >
      {/* Top line shimmer */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
      />
      <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 36, height: 36,
            background: 'rgba(34,197,94,0.13)',
            border: '1px solid rgba(34,197,94,0.18)',
          }}
        >
          <Home style={{ width: 16, height: 16, color: '#4ade80' }} />
        </div>
        <ChevronRight style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.2)' }} />
      </div>
      <div style={{ color: 'white', fontWeight: 700, fontSize: 'clamp(1rem, 4.5vw, 1.2rem)' }}>
        No {apt.number}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: '12px', marginTop: '2px' }}>1 görevli</div>
    </button>
  );
}

/* ─── Residents ───────────────────────────────────────────── */
function ResidentsScreen({ block, apartment }: { block: Block; apartment: Apartment }) {
  const ready = useEntrance();
  return (
    <div
      style={{
        opacity: ready ? 1 : 0,
        transform: ready ? 'none' : 'translateY(18px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      <div style={{ paddingTop: '20px', paddingBottom: '24px' }}>
        <div
          className="inline-flex items-center gap-1.5 rounded-full font-semibold"
          style={{
            fontSize: '11px', letterSpacing: '0.08em',
            padding: '5px 12px', marginBottom: '14px',
            background: 'rgba(34,197,94,0.12)', color: '#4ade80',
            border: '1px solid rgba(34,197,94,0.18)',
          }}
        >
          <Home style={{ width: 11, height: 11 }} />
          {block.name} · Daire {apartment.number}
        </div>
        <h2 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.6rem, 7vw, 2rem)', marginBottom: '4px' }}>
          Görevliyi Arayın
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '14px' }}>
          Butona basarak görevliyle bağlanın
        </p>
      </div>

      <ResidentCard resident={apartment.resident} />
    </div>
  );
}

function ResidentCard({ resident }: { resident: Resident }) {
  const [pressed, setPressed] = useState(false);
  const c = { from: '#052e16', to: '#16a34a', ring: 'rgba(34,197,94,0.28)' };

  return (
    <div
      className="overflow-hidden rounded-3xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Top shimmer line */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />

      <div style={{ padding: '18px 18px 20px' }}>
        {/* Identity */}
        <div className="flex items-center" style={{ gap: '14px', marginBottom: '18px' }}>
          <div
            className="flex items-center justify-center rounded-2xl flex-shrink-0 font-black text-white"
            style={{
              width: 52, height: 52,
              fontSize: '22px',
              background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
              boxShadow: `0 0 0 3px ${c.ring}, 0 6px 16px rgba(0,0,0,0.35)`,
            }}
          >
            {resident.name.charAt(0)}
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 'clamp(15px, 4.2vw, 18px)', lineHeight: 1.2 }}>
              {resident.name}
            </div>
            <div
              className="inline-flex items-center rounded-full font-semibold"
              style={{
                marginTop: '5px',
                fontSize: '11px',
                padding: '2px 10px',
                background: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.38)',
              }}
            >
              Görevli
            </div>
          </div>
        </div>

        {/* Call button */}
        <a
          href={`tel:${resident.phone}`}
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerLeave={() => setPressed(false)}
          className="flex items-center justify-center relative overflow-hidden rounded-2xl"
          style={{
            gap: '10px',
            width: '100%',
            minHeight: '54px',
            fontWeight: 700,
            fontSize: '16px',
            color: 'white',
            textDecoration: 'none',
            background: pressed
              ? 'linear-gradient(135deg, #15803d, #166534)'
              : 'linear-gradient(135deg, #22c55e, #16a34a)',
            boxShadow: pressed ? 'none' : '0 8px 24px rgba(34,197,94,0.32)',
            transform: pressed ? 'scale(0.97)' : 'scale(1)',
            transition: 'all 0.13s ease',
          }}
        >
          {/* Shimmer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 55%)' }}
          />
          <div
            className="relative flex items-center justify-center rounded-xl"
            style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.18)', zIndex: 1 }}
          >
            <Phone style={{ width: 17, height: 17, color: 'white', fill: 'white' }} />
          </div>
          <span style={{ position: 'relative', zIndex: 1 }}>Tıklayıp Ara</span>
        </a>
      </div>
    </div>
  );
}
