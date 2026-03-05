import { trpc } from '@/utils/api';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';

const zodiacMeta = ['☉ Gemini', '☽ Sagittarius', '↑ Aquarius'];

export default function HomeScreen() {

  const { data, isLoading, error } = useQuery(trpc.auth.healthCheck.queryOptions())


  return (
    <View style={styles.screen}>
      <Background />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header />
        <YourHoroscopeSection />
        <DailyTipsSection />

        <SectionTitle title="Today&apos;s Features" />
        <FeatureRow />

        <Heading text="Tarot Card of the day" />
        <TarotCard />
        <NatalCard />

        <SectionTitle title="Dating Calendar" />
        <CalendarCard />
      </ScrollView>
    </View>
  );
}

function YourHoroscopeSection() {
  return (
    <View style={styles.horoscopeWrap}>
      <Text style={styles.horoscopeTitle}>Your Horoscope</Text>

      <View style={styles.segmentedWrap}>
        <View style={styles.segmentActive}>
          <Text style={styles.segmentActiveText}>Today</Text>
        </View>
        {['Tomorrow', 'Week', 'Month', 'Year'].map((item) => (
          <Text key={item} style={styles.segmentText}>
            {item}
          </Text>
        ))}
      </View>

      <View style={styles.metricRow}>
        <MetricItem label="Love" percent={60} color="#FF7C80" />
        <MetricItem label="Health" percent={70} color="#F4D85F" />
        <MetricItem label="Career" percent={70} color="#B57BFF" />
      </View>

      <Text style={styles.powerText}>⭐ Power and Focus: Finances</Text>
      <Text style={styles.horoscopeBody}>
        You will benefit from the wealth and resources of others today, which means your partner or spouse can
        play a supportive role.
      </Text>

      <Pressable style={styles.readMoreButton}>
        <Text style={styles.readMoreText}>Read more</Text>
        <Feather name="chevron-down" size={20} color="#26D7CE" />
      </Pressable>
    </View>
  );
}

function MetricItem({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <View style={styles.metricItem}>
      <View style={styles.metricLabelRow}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Feather name="chevron-right" size={16} color="#C9C0A2" />
      </View>
      <View style={styles.metricBarTrack}>
        <View style={[styles.metricBarFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.metricPercent}>{percent}%</Text>
    </View>
  );
}

function DailyTipsSection() {
  return (
    <View style={styles.dailyTipsWrap}>
      <Text style={styles.dailyTipsTitle}>Daily Tips for Gemini</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tipsRow}>
        <TipCard
          title="Love"
          text="Just because you liked the friend-version of someone does not mean you'll like the relationship-version."
          icon="🫶"
        />
        <TipCard
          title="Career"
          text="Be careful with impulsive moves. Focus on timing and avoid reacting too fast to external pressure."
          icon="🔮"
        />
      </ScrollView>

      <View style={styles.pagerDots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

function TipCard({ title, text, icon }: { title: string; text: string; icon: string }) {
  return (
    <View style={styles.tipCard}>
      <View style={styles.tipHeader}>
        <Text style={styles.tipIcon}>{icon}</Text>
        <Text style={styles.tipTitle}>{title}</Text>
      </View>
      <Text style={styles.tipBody}>{text}</Text>
      <View style={styles.tipActions}>
        <View style={styles.tipActionCircle}>
          <Ionicons name="thumbs-up-outline" size={18} color="#DCCDA7" />
        </View>
        <View style={styles.tipActionCircle}>
          <Ionicons name="thumbs-down-outline" size={18} color="#DCCDA7" />
        </View>
      </View>
    </View>
  );
}

function Background() {
  return (
    <>
      <View style={styles.sky} />
      <View style={styles.moonGlow} />
      <View style={styles.horizon} />
      <View style={styles.waterline} />
    </>
  );
}

function Header() {
  return (
    <View style={styles.headerWrap}>
      <View style={styles.topBar}>
        <Text style={styles.userName}>Ersin ›</Text>
        <View style={styles.actions}>
          <Ionicons name="settings-outline" size={30} color="#E2D8BC" />
          <Text style={styles.diamond}>💎</Text>
          <View style={styles.redDot} />
        </View>
      </View>

      <View style={styles.zodiacRow}>
        {zodiacMeta.map((item) => (
          <Text key={item} style={styles.zodiacItem}>
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionDot} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function Heading({ text }: { text: string }) {
  return <Text style={styles.heading}>{text}</Text>;
}

function FeatureRow() {
  return (
    <View style={styles.featureRow}>
      <MiniFeature label="Lucky color" value={<View style={styles.colorCircle} />} />
      <MiniFeature label="Lucky Number" value={<Text style={styles.featureBig}>58</Text>} />
      <MiniFeature label="Lucky Time" value={<Text style={styles.featureTime}>4:15 pm -{`\n`}4:37 pm</Text>} />
    </View>
  );
}

function MiniFeature({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <View style={styles.miniCard}>
      <Feather name="chevron-right" size={22} color="#BEB594" style={styles.chevron} />
      <View style={styles.miniContent}>{value}</View>
      <Text style={styles.miniLabel}>{label}</Text>
    </View>
  );
}

function TarotCard() {
  return (
    <View style={styles.tarotCard}>
      <View style={styles.tarotLeft}>
        <Text style={styles.cardsEmoji}>🃏</Text>
      </View>

      <View style={styles.tarotRight}>
        <Text style={styles.tarotText}>Get the guidance you need to seize the day at its fullest!</Text>
        <Pressable style={styles.cta}>
          <Text style={styles.ctaText}>Get reading</Text>
          <Feather name="chevron-right" size={22} color="#D5FFF9" />
        </Pressable>
      </View>
    </View>
  );
}

function NatalCard() {
  return (
    <Pressable style={styles.natalCard}>
      <View style={styles.natalIconWrap}>
        <MaterialCommunityIcons name="solar-power" size={32} color="#FFF7D6" />
      </View>
      <View style={styles.natalTextWrap}>
        <Text style={styles.natalTitle}>Read your natal horoscope</Text>
        <Text style={styles.natalSubtitle}>Horoscope based on your Birth Chart</Text>
      </View>
      <Feather name="chevron-right" size={30} color="#F2E9CD" />
    </Pressable>
  );
}

function CalendarCard() {
  return (
    <View style={styles.calendarCard}>
      <Text style={styles.monthText}>Subat, 2026</Text>
      <View style={styles.weekRow}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#021420',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 24,
    gap: 14,
  },
  sky: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A2E42',
  },
  moonGlow: {
    position: 'absolute',
    top: 180,
    right: 120,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#4B7A4A4D',
  },
  horizon: {
    position: 'absolute',
    top: 260,
    left: 0,
    right: 0,
    height: 190,
    backgroundColor: '#0B3A4B',
  },
  waterline: {
    position: 'absolute',
    top: 300,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#2A7587',
    opacity: 0.35,
  },
  headerWrap: {
    gap: 10,
  },
  horoscopeWrap: {
    gap: 12,
    marginTop: 2,
  },
  horoscopeTitle: {
    color: '#EFE5C9',
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '500',
  },
  segmentedWrap: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#356173',
    backgroundColor: '#174859',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    gap: 16,
  },
  segmentActive: {
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFE5C8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  segmentActiveText: {
    color: '#132738',
    fontSize: 20,
    fontWeight: '700',
  },
  segmentText: {
    color: '#B6C2C6',
    fontSize: 18,
    fontWeight: '700',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricItem: {
    flex: 1,
    gap: 4,
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricLabel: {
    color: '#E9DFC3',
    fontSize: 16,
    fontWeight: '700',
  },
  metricBarTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#4A5D66',
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  metricPercent: {
    color: '#A3B1B8',
    fontSize: 15,
    fontWeight: '700',
  },
  powerText: {
    color: '#EFDDB4',
    fontSize: 17,
    fontWeight: '700',
  },
  horoscopeBody: {
    color: '#DAE1E5',
    fontSize: 16,
    lineHeight: 28,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 2,
  },
  readMoreText: {
    color: '#26D7CE',
    fontSize: 19,
    fontWeight: '700',
  },
  dailyTipsWrap: {
    gap: 12,
  },
  dailyTipsTitle: {
    color: '#EFE5C9',
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '500',
  },
  tipsRow: {
    gap: 12,
    paddingRight: 18,
  },
  tipCard: {
    width: 340,
    borderRadius: 24,
    backgroundColor: '#1B4557',
    padding: 18,
    minHeight: 300,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipIcon: {
    fontSize: 30,
  },
  tipTitle: {
    color: '#EFE5C9',
    fontSize: 24,
    fontWeight: '700',
  },
  tipBody: {
    marginTop: 14,
    color: '#DBE3E7',
    fontSize: 16,
    lineHeight: 30,
  },
  tipActions: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  tipActionCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2C596C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2F6171',
  },
  dotActive: {
    backgroundColor: '#24D3CB',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    color: '#E7DFC5',
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  diamond: {
    fontSize: 35,
  },
  redDot: {
    position: 'absolute',
    right: -6,
    top: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF5E57',
  },
  zodiacRow: {
    flexDirection: 'row',
    gap: 18,
    flexWrap: 'wrap',
  },
  zodiacItem: {
    color: '#D7CEB2',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 2,
  },
  sectionDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF5F50',
  },
  sectionTitle: {
    color: '#EFE5C9',
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '500',
  },
  featureRow: {
    flexDirection: 'row',
    gap: 10,
  },
  miniCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#1B4557',
    padding: 12,
    minHeight: 130,
  },
  chevron: {
    alignSelf: 'flex-end',
  },
  miniContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#C7CBD2',
  },
  featureBig: {
    color: '#E8DEC3',
    fontSize: 36,
    lineHeight: 38,
  },
  featureTime: {
    color: '#E8DEC3',
    fontSize: 20,
    lineHeight: 25,
    textAlign: 'center',
  },
  miniLabel: {
    color: '#E2DAC2',
    fontSize: 17,
  },
  heading: {
    color: '#EFE5C9',
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '500',
  },
  tarotCard: {
    borderRadius: 24,
    backgroundColor: '#1B4557',
    padding: 14,
    flexDirection: 'row',
    gap: 14,
  },
  tarotLeft: {
    width: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsEmoji: {
    fontSize: 56,
  },
  tarotRight: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 14,
  },
  tarotText: {
    color: '#E9F2EE',
    fontSize: 16,
    lineHeight: 24,
  },
  cta: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#26D7C6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: {
    color: '#D8FFF9',
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 24,
  },
  natalCard: {
    borderRadius: 20,
    backgroundColor: '#313C68',
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  natalIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#344A80',
    alignItems: 'center',
    justifyContent: 'center',
  },
  natalTextWrap: {
    flex: 1,
  },
  natalTitle: {
    color: '#F5EFD8',
    fontSize: 19,
    fontWeight: '700',
  },
  natalSubtitle: {
    color: '#CFD0D8',
    fontSize: 16,
    marginTop: 2,
  },
  calendarCard: {
    borderRadius: 24,
    backgroundColor: '#1B4557',
    padding: 20,
    minHeight: 230,
  },
  monthText: {
    color: '#EFE5C9',
    fontSize: 21,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 8,
  },
  weekRow: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDay: {
    color: '#23D1C8',
    fontSize: 16,
    fontWeight: '700',
  },
});
