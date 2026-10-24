import wave,math,random,struct
from pathlib import Path
root=Path(__file__).resolve().parents[1]/'assets'/'audio';root.mkdir(parents=True,exist_ok=True);rate=22050
kinds={'sword':(.22,700),'axe':(.3,140),'dagger':(.13,1100),'bow':(.23,370),'arrow':(.3,1700),'magic':(.48,530),'hit':(.16,100),'armor':(.3,1200),'crit':(.4,1500),'miss':(.18,1100),'mine-tree':(.22,190),'mine-rock':(.27,850),'player-hurt':(.22,180),'slime':(.3,115),'bat':(.22,900),'undead':(.4,150),'beast':(.55,120),'goblin':(.3,360),'spirit':(.6,580),'boss':(.7,95),'merchant':(.5,210)}
for name,(duration,freq) in kinds.items():
 for variant in range(2):
  rng=random.Random(name+str(variant));samples=[];smooth=0
  for i in range(int(rate*duration)):
   t=i/rate;u=t/duration;noise=rng.uniform(-1,1);smooth=smooth*.83+noise*.17;env=min(1,t/.012)*max(0,1-u)**2;f=freq*(1+variant*.08)*(1-u*.35)
   if name in ['sword','dagger','miss','arrow']:v=(noise*.5+smooth*2)*math.sin(math.pi*u)**2*.38
   elif name=='bow':v=(math.sin(2*math.pi*f*t)+.3*math.sin(2*math.pi*f*2.01*t))*math.exp(-t*18)*.35+smooth*.15*env
   elif name in ['magic','crit','spirit']:v=(math.sin(2*math.pi*f*t)+.4*math.sin(2*math.pi*f*1.5*t)+.2*math.sin(2*math.pi*f*2.01*t))*.24*env
   elif name in ['armor','mine-rock']:v=(math.sin(2*math.pi*f*t)+.4*math.sin(2*math.pi*f*2.43*t))*env*.3+noise*.08*env
   else:v=(math.sin(2*math.pi*f*t+math.sin(2*math.pi*32*t)*1.8)*.35+smooth*.9)*env
   samples.append(struct.pack('<h',int(max(-.8,min(.8,v))*25000)))
  with wave.open(str(root/f'{name}-{variant}.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(b''.join(samples))
print('42 local WAV effects generated')
