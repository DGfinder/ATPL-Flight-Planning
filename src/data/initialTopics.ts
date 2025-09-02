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
  },
  {
    topicId: 'speed_sound_mach_tat',
    theory: `The Speed of Sound and Mach Numbers

Atmosphere is the medium in which an aircraft operates and the atmospheric properties help in the generation of lift for an aircraft to fly. The changes in temperature, pressure and humidity affect the aircraft's overall performance. A moving aircraft always experiences both static and dynamic pressure, however, all the aerodynamic forces acting on an aircraft are determined by dynamic pressure. Therefore, pilots must have a clear indication of the pressure in an appropriate manner and this is provided by the Air Speed Indicator (ASI).

The ASI displays the Indicated Air Speed (IAS) to the pilots. However, there are other speeds including Calibrated Air Speed, Equivalent Air Speed and True Air Speed. TAS is the actual speed of an aircraft moving through air and is the only real speed as the rest are measurements of dynamic pressure (air entering a pitot tube). When talking about the modern Air Speed Indicators, the CAS and IAS are considered to be the same. However, at high speeds and high altitudes, it is essential for a pilot to remember your TAS will be significantly different than IAS or CAS. At these altitudes and speeds, it is also important for a pilot to know their aircraft's speed relative to the speed of sound, which is another speed for the pilots of jet aircrafts to be familiar with.

This relationship is known as the Mach Number (M). As an aircraft reaches higher speeds, it greatly affects the air's compressibility and the aircraft can experience undesirable handling characteristics. In order to avoid this in flight, it is very important to analyse the aircraft's speed relative to the speed of sound.

Mach numbers that are less than 1.0 represents subsonic speeds, while greater than 1.0 show supersonic speeds. When the aircraft's speed equals the speed of sound, the Mach number is equal to 1.0 (M=1.0). As aircraft approach speeds greater than Mach 1.01 there is potential for shock waves to form on the aircraft body which affects both lift and drag properties.

Chuck Yeager, first man to fly faster than the speed of sound

The speed of sound is not constant and varies with temperature, being proportional to the square root of air's absolute temperature. On a standard day at sea level, the value of the local speed of sound (LSS) is about 660 knots. Colder temperatures will result in a lower speed of sound and hotter days will result in a higher speed of sound. It is approximately 1kt higher of lower for every 1 degree warmer or cooler than ISA.

The Speed of Sound in knots can be found using the following formula:
TAS=39xvK

The Kelvin Scale {K) commences at absolute zero which is -273° C.
Therefore O C = 273K. On an ISA day at MSL (15°C) we can say the temp is 288K

You will be familiar from your previous study that temperature drops at about 2 degrees per thousand feet in altitude. We use 2 degrees per thousand in PPL and CPL for simplicity, but to be precise temperature decreases 1.98 degrees per one thousand feet increase in altitude. You may think the 0.02 degrees wouldn't make a difference but when you are talking in the tens of thousands of feet, it can.

Because we can calculate temperature drop with altitude, we can fairly accurately estimate the actual temperature at a given height.

As the International Standard Atmosphere (ISA) is a hypothetical model based on a hypothetical standard day, the actual everyday conditions differ from the standard ISA conditions of temperature, pressure and density. This difference in the actual conditions as compared to the ISA standard conditions is expressed in the form of ISA deviation.

For example, if the MSL temperature at a given time is 32°C we say this is hotter than ISA (15° C) by 17° C and we would write this temperature as ISA+17.

This methodology of expressing temperature relative to ISA can be used at any altitude and later in this course we will see that our high altitude forecast temperatures for flight planning are converted to ISA deviations, as the Boeing 727 Handbook uses an ISA deviation format.`,
    videos: [
      {
        id: 'mach_video_1',
        title: 'Speed of Sound and Mach Numbers Explained',
        youtubeId: 'dQw4w9WgXcQ',
        description: 'Comprehensive explanation of the speed of sound, Mach numbers, and their relationship to aircraft performance at high altitudes.'
      }
    ],
    practice: [
      {
        id: 'mach_practice_1',
        title: 'ISA Temperature Calculations',
        content: 'INTERACTIVE_TABLE:ISA',
        type: 'exercise'
      }
    ],
    lastUpdated: new Date().toISOString()
  }
];