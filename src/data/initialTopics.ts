import type { TopicContent } from '../types';

export const initialTopics: TopicContent[] = [
  {
    topicId: 'tas_heading_ground_speed',
    theory: `TAS, Heading and Ground Speed determinations using the flight computer

Learning how to use the flight computer is one of the basic elements that student pilots are taught during the initial stages of training. It is very important to remain confident using the computer (whiz wheel) as setting it up can sometimes be confusing if you are out of practice. However, it is very simple and produces accurate results if used correctly. You must be familiar with using the computer to obtain the wind components and drift.

This is also a good time to review Effective True Air Speed (ETAS) as it can play a significant role in ATPL flight planning. If we have a significant amount of crosswind resulting in a sizable drift angle, the TAS along the track made good will be less than the aircraft actual TAS. This is what we call Effective True Air Speed (ETAS). Historically it has been considered that up to 10° of drift angle, the difference between TAS and ETAS is not significant. However, for ATPL flight planning we need to consider any drift angle of more than 5° as stated in the ATPL Examination Guide from CASA.

Example Calculation:

Given:
FPT 225°
TAS 350 knots
W/V 190° / 90 kts (not unusual at high altitude)

Calculate the HOG and GS

Step 1. Set TAS over the TAS mark
Step 2. Rotate the inner whiz wheel and mark a wind speed and direction at 90 knots up from the centre of the wheel on 190°
Step 3. Rotate the inner whiz wheel till the FTP (225°) is up from the centre
Step 4. Read off the nav computer 53 knots of crosswind from the left and 72 knots of head wind
Step 5. Convert the crosswind to a drift angle of 8°
Step 6. Now look to the left of the TAS arrow 8° and read off ETAS 345 knots
Step 7. Subtract the 72 knots of head wind from the ETAS to get a ground speed of 273 knots

You can see on the previous page, if we hadn't corrected for ETAS, the ground speed would have been out by 10 kts. High altitude winds can often be in excess of 100 kts so it is easy to see how our flight planning can be affected by ETAS if it is not used correctly.

For the purposes of flight planning, we combine the reduction of ETAS and our wind component together to give us a Wind Component (WC).

For example, if our TAS was reduced from 400kts to 395kts, it is the equivalent to a 5 knot headwind which can then be combined with our regular headwind/tailwind.

Note: ETAS will always be reduction - it will always slow you down.`,
    videos: [
      {
        id: 'tas_video_1',
        title: 'TAS, Heading and Ground Speed - Flight Computer Tutorial',
        youtubeId: 'nLjsPMARlu8',
        description: 'Comprehensive tutorial on using the flight computer for TAS, heading, and ground speed calculations including ETAS considerations.'
      }
    ],
    practice: [
      {
        id: 'tas_practice_table',
        title: 'TAS Practice Calculations',
        content: 'INTERACTIVE_TABLE:TAS',
        type: 'exercise'
      }
    ],
    lastUpdated: new Date().toISOString()
  }
];