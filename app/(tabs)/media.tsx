import { useMemo, useState } from 'react';
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Screen } from '../../src/components/Screen';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import {
  MINDSET_CLIPS,
  ORTHODOX_CLIPS,
  youtubeEmbedUrl,
  youtubeSearchUrl,
  youtubeWatchUrl,
} from '../../src/constants/mediaFeeds';
import type { MediaClip, MediaTab } from '../../src/models/types';
import { colors, fonts, typography } from '../../src/theme';

export default function MediaScreen() {
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<MediaTab>('mindset');
  const [active, setActive] = useState<MediaClip | null>(null);

  const clips = useMemo(
    () => (tab === 'mindset' ? MINDSET_CLIPS : ORTHODOX_CLIPS),
    [tab],
  );

  const embedHeight = Math.min(240, Math.round(width * 0.52));

  return (
    <Screen
      title="Source Refresher"
      subtitle="Dual-filtered mindset & Orthodox feeds"
      scroll={!active}
    >
      <View style={styles.tabs}>
        <Pressable
          onPress={() => {
            setTab('mindset');
            setActive(null);
          }}
          style={[styles.tab, tab === 'mindset' && styles.tabActiveAmber]}
        >
          <Text
            style={[
              styles.tabText,
              tab === 'mindset' && { color: colors.black },
            ]}
          >
            Mindset Mastery
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setTab('orthodox');
            setActive(null);
          }}
          style={[styles.tab, tab === 'orthodox' && styles.tabActiveCyan]}
        >
          <Text
            style={[
              styles.tabText,
              tab === 'orthodox' && { color: colors.black },
            ]}
          >
            Orthodox Omilies
          </Text>
        </Pressable>
      </View>

      {active ? (
        <View style={styles.player}>
          <WebView
            style={{ height: embedHeight, borderRadius: 12 }}
            source={{ uri: youtubeEmbedUrl(active.youtubeId) }}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
          />
          <Text style={styles.clipTitle}>{active.title}</Text>
          <Text style={typography.label}>{active.channel}</Text>
          <View style={styles.playerActions}>
            <PrimaryButton
              label="Open on YouTube"
              tone="amber"
              onPress={() =>
                void Linking.openURL(youtubeWatchUrl(active.youtubeId))
              }
            />
            <PrimaryButton
              label="Back to list"
              tone="muted"
              onPress={() => setActive(null)}
            />
          </View>
        </View>
      ) : (
        <>
          <Text style={typography.body}>
            {tab === 'mindset'
              ? 'High-performance mindset and motivation clips filtered for execution energy.'
              : 'Greek Orthodox monastic fathers, omilies, and theological lectures.'}
          </Text>
          <PrimaryButton
            label="Refresh query feed"
            tone="cyan"
            onPress={() =>
              void Linking.openURL(
                youtubeSearchUrl(
                  tab === 'mindset'
                    ? 'high performance mindset discipline motivation'
                    : 'greek orthodox monastic fathers omilia theology',
                ),
              )
            }
          />
          {clips.map((clip) => (
            <Pressable
              key={clip.id}
              onPress={() => setActive(clip)}
              style={styles.card}
            >
              <Text style={styles.clipTitle}>{clip.title}</Text>
              <Text style={typography.label}>{clip.channel}</Text>
              <Text style={styles.query}>query · {clip.queryTag}</Text>
            </Pressable>
          ))}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
  },
  tabActiveAmber: {
    backgroundColor: colors.amber,
    borderColor: colors.amber,
  },
  tabActiveCyan: {
    backgroundColor: colors.cyan,
    borderColor: colors.cyan,
  },
  tabText: {
    fontFamily: fonts.bodyBold,
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    padding: 14,
    gap: 4,
  },
  clipTitle: {
    fontFamily: fonts.bodyBold,
    color: colors.textPrimary,
    fontSize: 16,
  },
  query: {
    fontFamily: fonts.body,
    color: colors.cyan,
    fontSize: 12,
    marginTop: 4,
  },
  player: { gap: 10 },
  playerActions: { gap: 8 },
});
