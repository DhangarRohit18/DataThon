from typing import List
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.domain.models import FIR

class FIRRepository(BaseRepository[FIR]):
    def __init__(self, db):
        super().__init__(FIR, db)

    async def get_by_case_number(self, case_number: str) -> FIR | None:
        query = (
            select(self.model)
            .where(self.model.case_number == case_number)
            .options(selectinload(self.model.accused_list), selectinload(self.model.evidence))
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_filtered(
        self,
        district: str | None = None,
        police_station_id: str | None = None,
        crime_type: str | None = None,
        status: str | None = None,
        limit: int = 100
    ) -> List[FIR]:
        query = select(self.model).options(
            selectinload(self.model.accused_list), selectinload(self.model.evidence)
        )
        
        if district:
            # We can filter through station relation
            from app.domain.models import PoliceStation
            query = query.join(self.model.police_station).where(PoliceStation.district == district)
            
        if police_station_id:
            query = query.where(self.model.police_station_id == police_station_id)
            
        if crime_type:
            query = query.where(self.model.crime_type == crime_type)
            
        if status:
            query = query.where(self.model.status == status)
            
        query = query.limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())
